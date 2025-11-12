/**
 * Voice Analytics - Tracking de l'activité vocale
 * Utilise les événements VoiceStateUpdate pour tracker les sessions vocales
 */

/**
 * Tracker une session vocale (à appeler depuis VoiceStateUpdate event)
 */
export async function trackVoiceSession(userId, guildId, channelId, joinedAt, leftAt, supabase) {
  if (!leftAt) {
    // Session en cours, créer l'entrée
    const { error } = await supabase
      .from('voice_sessions')
      .insert({
        user_id: userId,
        guild_id: guildId,
        channel_id: channelId,
        joined_at: joinedAt.toISOString(),
      });

    if (error && error.code !== '23505') { // Ignorer les doublons
      console.error('Erreur tracking session vocale:', error);
    }
    return { duration: 0, ongoing: true };
  }

  // Session terminée, calculer la durée
  const durationMinutes = Math.round((leftAt - joinedAt) / (1000 * 60));

  // Mettre à jour la session
  const { error: updateError } = await supabase
    .from('voice_sessions')
    .update({
      left_at: leftAt.toISOString(),
      duration_minutes: durationMinutes,
    })
    .eq('user_id', userId)
    .eq('guild_id', guildId)
    .eq('channel_id', channelId)
    .is('left_at', null)
    .order('joined_at', { ascending: false })
    .limit(1);

  if (updateError) {
    console.error('Erreur mise à jour session vocale:', updateError);
  }

  // Mettre à jour les stats agrégées
  await updateVoiceStats(userId, guildId, durationMinutes, supabase);

  return { duration: durationMinutes, ongoing: false };
}

/**
 * Met à jour les statistiques vocales agrégées
 */
async function updateVoiceStats(userId, guildId, durationMinutes, supabase) {
  const { data: existing } = await supabase
    .from('voice_stats')
    .select('*')
    .eq('user_id', userId)
    .eq('guild_id', guildId)
    .single();

  if (existing) {
    await supabase
      .from('voice_stats')
      .update({
        total_minutes: existing.total_minutes + durationMinutes,
        sessions_count: existing.sessions_count + 1,
        last_session_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('guild_id', guildId);
  } else {
    await supabase
      .from('voice_stats')
      .insert({
        user_id: userId,
        guild_id: guildId,
        total_minutes: durationMinutes,
        sessions_count: 1,
        last_session_at: new Date().toISOString(),
      });
  }
}

/**
 * Récupère les statistiques vocales d'un serveur
 */
export async function getVoiceStats(guildId, supabase, timeWindowHours = 168) {
  const timeWindow = new Date();
  timeWindow.setHours(timeWindow.getHours() - timeWindowHours);

  // Récupérer les sessions de la période
  const { data: sessions } = await supabase
    .from('voice_sessions')
    .select('user_id, channel_id, duration_minutes, joined_at')
    .eq('guild_id', guildId)
    .gte('joined_at', timeWindow.toISOString())
    .not('duration_minutes', 'is', null);

  if (!sessions || sessions.length === 0) {
    return {
      totalHours: 0,
      activeMembers: 0,
      topMembers: [],
      topChannels: [],
      peakHours: [],
      message: 'Aucune activité vocale enregistrée pour cette période.',
    };
  }

  // Calculer le temps total
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

  // Membres actifs uniques
  const uniqueMembers = new Set(sessions.map(s => s.user_id));
  const activeMembers = uniqueMembers.size;

  // Top membres par temps total
  const memberStats = {};
  sessions.forEach(s => {
    if (!memberStats[s.user_id]) {
      memberStats[s.user_id] = { totalMinutes: 0, sessions: 0 };
    }
    memberStats[s.user_id].totalMinutes += s.duration_minutes || 0;
    memberStats[s.user_id].sessions += 1;
  });

  const topMembers = Object.entries(memberStats)
    .sort((a, b) => b[1].totalMinutes - a[1].totalMinutes)
    .slice(0, 10)
    .map(([userId, stats]) => ({
      user_id: userId,
      hours: Math.round((stats.totalMinutes / 60) * 10) / 10,
      sessions: stats.sessions,
    }));

  // Top canaux
  const channelStats = {};
  sessions.forEach(s => {
    if (!channelStats[s.channel_id]) {
      channelStats[s.channel_id] = 0;
    }
    channelStats[s.channel_id] += s.duration_minutes || 0;
  });

  const topChannels = Object.entries(channelStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([channelId, minutes]) => ({
      channel_id: channelId,
      hours: Math.round((minutes / 60) * 10) / 10,
    }));

  // Heures de pic (approximation basée sur joined_at)
  const hourStats = {};
  sessions.forEach(s => {
    const hour = new Date(s.joined_at).getHours();
    hourStats[hour] = (hourStats[hour] || 0) + 1;
  });

  const peakHours = Object.entries(hourStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour, count]) => ({
      hour: parseInt(hour),
      sessions: count,
    }));

  return {
    totalHours,
    activeMembers,
    topMembers,
    topChannels,
    peakHours,
    totalSessions: sessions.length,
  };
}

