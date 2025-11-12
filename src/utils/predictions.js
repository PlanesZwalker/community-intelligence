/**
 * Service de Prédictions et Alertes Proactives
 * Analyse les tendances et génère des prédictions pour les 7 prochains jours
 */

/**
 * Récupère les statistiques d'une semaine spécifique
 */
async function getWeekStats(guildId, weekOffset, supabase) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - (7 * (weekOffset + 1)));
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() - (7 * weekOffset));

  // Messages de la semaine
  const { count: messages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('guild_id', guildId)
    .gte('created_at', weekStart.toISOString())
    .lt('created_at', weekEnd.toISOString());

  // Membres actifs (uniques)
  const { data: activeMembersData } = await supabase
    .from('messages')
    .select('author_id')
    .eq('guild_id', guildId)
    .gte('created_at', weekStart.toISOString())
    .lt('created_at', weekEnd.toISOString());

  const uniqueMembers = new Set(activeMembersData?.map(m => m.author_id) || []);
  const activeMembers = uniqueMembers.size;

  // Messages quotidiens moyens
  const dailyMessages = (messages || 0) / 7;

  // Questions posées
  const { count: questions } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('guild_id', guildId)
    .eq('is_question', true)
    .gte('created_at', weekStart.toISOString())
    .lt('created_at', weekEnd.toISOString());

  // Réponses aux questions
  const { count: replies } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('guild_id', guildId)
    .eq('is_reply', true)
    .gte('created_at', weekStart.toISOString())
    .lt('created_at', weekEnd.toISOString());

  const answerRate = questions > 0 ? (replies / questions) * 100 : 0;

  return {
    messages: messages || 0,
    activeMembers,
    dailyMessages: Math.round(dailyMessages),
    questions: questions || 0,
    answerRate: Math.round(answerRate * 10) / 10,
  };
}

/**
 * Détecte les membres VIP inactifs
 */
async function detectInactiveVIPs(guildId, supabase, daysInactive = 5) {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - daysInactive);

  // Récupérer les membres les plus actifs historiquement
  const { data: topMembers } = await supabase
    .from('member_xp')
    .select('user_id, xp, total_messages, last_message_at')
    .eq('guild_id', guildId)
    .order('xp', { ascending: false })
    .limit(20);

  if (!topMembers) return [];

  const inactiveVIPs = [];

  for (const member of topMembers) {
    if (!member.last_message_at) continue;

    const lastMessage = new Date(member.last_message_at);
    if (lastMessage < threshold) {
      inactiveVIPs.push({
        user_id: member.user_id,
        xp: member.xp,
        days_inactive: Math.floor((Date.now() - lastMessage.getTime()) / (1000 * 60 * 60 * 24)),
      });
    }
  }

  return inactiveVIPs.slice(0, 5); // Top 5
}

/**
 * Récupère les questions anciennes non répondues
 */
async function getOldQuestions(guildId, supabase, daysOld = 3) {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - daysOld);

  const { data: questions } = await supabase
    .from('messages')
    .select('message_id, content, author_id, created_at, channel_id')
    .eq('guild_id', guildId)
    .eq('is_question', true)
    .eq('is_reply', false)
    .lt('created_at', threshold.toISOString())
    .order('created_at', { ascending: false })
    .limit(20);

  return questions || [];
}

/**
 * Analyse les tendances par canal
 */
async function analyzeChannelTrends(guildId, supabase) {
  const now = new Date();
  const last48h = new Date(now.getTime() - (48 * 60 * 60 * 1000));
  const previous48h = new Date(now.getTime() - (96 * 60 * 60 * 1000));

  // Messages des dernières 48h par canal
  const { data: recentMessages } = await supabase
    .from('messages')
    .select('channel_id')
    .eq('guild_id', guildId)
    .gte('created_at', last48h.toISOString())
    .lt('created_at', now.toISOString());

  // Messages des 48h précédentes par canal
  const { data: previousMessages } = await supabase
    .from('messages')
    .select('channel_id')
    .eq('guild_id', guildId)
    .gte('created_at', previous48h.toISOString())
    .lt('created_at', last48h.toISOString());

  // Compter par canal
  const recentCounts = {};
  recentMessages?.forEach(msg => {
    recentCounts[msg.channel_id] = (recentCounts[msg.channel_id] || 0) + 1;
  });

  const previousCounts = {};
  previousMessages?.forEach(msg => {
    previousCounts[msg.channel_id] = (previousCounts[msg.channel_id] || 0) + 1;
  });

  // Calculer les tendances
  const trends = [];
  for (const [channelId, recentCount] of Object.entries(recentCounts)) {
    const previousCount = previousCounts[channelId] || 0;
    if (previousCount === 0) continue;

    const change = ((recentCount - previousCount) / previousCount) * 100;
    if (change < -30) { // Baisse de plus de 30%
      trends.push({
        channel_id: channelId,
        change: Math.round(change),
        recent_count: recentCount,
        previous_count: previousCount,
      });
    }
  }

  return trends.sort((a, b) => a.change - b.change).slice(0, 5); // Top 5 canaux en baisse
}

/**
 * Génère des recommandations basées sur les données
 */
async function generateRecommendations(predictions, supabase, guildId) {
  const recommendations = [];

  // Recommandation basée sur la baisse d'engagement
  if (predictions.engagement_trend < -0.1) {
    recommendations.push({
      priority: 'high',
      text: 'Lancer un sondage dans #général pour relancer l\'engagement',
      emoji: '📊',
    });
  }

  // Recommandation basée sur les questions non répondues
  if (predictions.unanswered_questions.length > 10) {
    recommendations.push({
      priority: 'high',
      text: `${predictions.unanswered_questions.length} questions non répondues. Organiser une session Q&A.`,
      emoji: '❓',
    });
  }

  // Recommandation basée sur les VIP inactifs
  if (predictions.inactive_vips.length > 0) {
    const topInactive = predictions.inactive_vips[0];
    recommendations.push({
      priority: 'medium',
      text: `Contacter les membres très actifs inactifs (${predictions.inactive_vips.length} détectés)`,
      emoji: '👥',
    });
  }

  // Recommandation basée sur les canaux en baisse
  if (predictions.channel_trends.length > 0) {
    recommendations.push({
      priority: 'medium',
      text: `Organiser un événement ce weekend pour relancer l'activité`,
      emoji: '🎉',
    });
  }

  // Recommandation générique si engagement stable
  if (predictions.engagement_trend >= -0.05 && predictions.engagement_trend <= 0.05) {
    recommendations.push({
      priority: 'low',
      text: 'Engagement stable. Maintenir le rythme actuel.',
      emoji: '✅',
    });
  }

  return recommendations;
}

/**
 * Génère les prédictions pour les 7 prochains jours
 */
export async function generatePredictions(guildId, supabase) {
  try {
    // Comparer semaine actuelle vs semaine précédente
    const currentWeek = await getWeekStats(guildId, 0, supabase);
    const previousWeek = await getWeekStats(guildId, 1, supabase);

    // Calculer les tendances
    const engagementTrend = previousWeek.messages > 0
      ? ((currentWeek.messages - previousWeek.messages) / previousWeek.messages) * 100
      : 0;

    // Prédire les 7 prochains jours (extrapolation linéaire)
    const predictedMessages = Math.round(
      currentWeek.messages + (currentWeek.messages * (engagementTrend / 100))
    );
    const predictedDailyMessages = Math.round(predictedMessages / 7);

    // Prédire nouveaux membres (basé sur la tendance)
    const predictedNewMembers = Math.round(currentWeek.activeMembers * 0.1); // Approximation

    // Détecter les problèmes
    const inactiveVIPs = await detectInactiveVIPs(guildId, supabase, 5);
    const unansweredQuestions = await getOldQuestions(guildId, supabase, 3);
    const channelTrends = await analyzeChannelTrends(guildId, supabase);

    const predictions = {
      engagement_trend: Math.round(engagementTrend * 10) / 10,
      predicted_messages: predictedMessages,
      predicted_daily_messages: predictedDailyMessages,
      predicted_new_members: predictedNewMembers,
      inactive_vips: inactiveVIPs,
      unanswered_questions: unansweredQuestions,
      channel_trends: channelTrends,
      current_week: currentWeek,
      previous_week: previousWeek,
    };

    // Générer les recommandations
    const recommendations = await generateRecommendations(predictions, supabase, guildId);

    return {
      ...predictions,
      recommendations,
    };
  } catch (error) {
    console.error('Erreur génération prédictions:', error);
    throw error;
  }
}

