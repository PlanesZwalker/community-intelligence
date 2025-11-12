/**
 * Système de détection de bots et spam
 * Identifie les comptes suspects et les patterns de spam
 */

/**
 * Détecte si un utilisateur Discord est potentiellement un bot/spam
 * Basé sur plusieurs indicateurs
 */
export async function detectBotOrSpam(user, messages, supabase, guildId) {
  const indicators = {
    isBot: false,
    isSpam: false,
    confidence: 0,
    reasons: [],
  };

  // 1. Vérifier si c'est un bot Discord officiel
  if (user.bot) {
    indicators.isBot = true;
    indicators.confidence = 100;
    indicators.reasons.push('Compte bot Discord officiel');
    return indicators;
  }

  // 2. Vérifier l'âge du compte
  const accountAge = Date.now() - user.createdTimestamp;
  const daysOld = accountAge / (1000 * 60 * 60 * 24);

  if (daysOld < 7) {
    indicators.confidence += 30;
    indicators.reasons.push(`Compte créé il y a ${Math.round(daysOld)} jours (< 7 jours)`);
  }

  // 3. Vérifier l'avatar
  if (!user.avatar) {
    indicators.confidence += 15;
    indicators.reasons.push('Pas d\'avatar personnalisé');
  }

  // 4. Vérifier les messages répétitifs
  if (messages && messages.length > 0) {
    const recentMessages = messages.slice(-10); // Derniers 10 messages
    const uniqueMessages = new Set(recentMessages.map(m => m.content.toLowerCase().trim()));
    const repetitionRate = 1 - (uniqueMessages.size / recentMessages.length);

    if (repetitionRate > 0.5) {
      indicators.isSpam = true;
      indicators.confidence += 40;
      indicators.reasons.push(`Taux de répétition élevé (${Math.round(repetitionRate * 100)}%)`);
    }

    // 5. Vérifier la longueur des messages (spam souvent très court ou très long)
    const avgLength = recentMessages.reduce((sum, m) => sum + m.content.length, 0) / recentMessages.length;
    if (avgLength < 5 || avgLength > 2000) {
      indicators.confidence += 10;
      indicators.reasons.push(`Longueur moyenne suspecte (${Math.round(avgLength)} caractères)`);
    }

    // 6. Vérifier les liens suspects
    const linkCount = recentMessages.filter(m => 
      /https?:\/\//.test(m.content) || /discord\.gg|discord\.com\/invite/.test(m.content)
    ).length;
    
    if (linkCount > recentMessages.length * 0.5) {
      indicators.isSpam = true;
      indicators.confidence += 30;
      indicators.reasons.push(`Trop de liens dans les messages (${linkCount}/${recentMessages.length})`);
    }

    // 7. Vérifier la fréquence des messages (spam = beaucoup de messages en peu de temps)
    if (recentMessages.length >= 5) {
      const timeSpan = new Date(recentMessages[recentMessages.length - 1].created_at) - 
                       new Date(recentMessages[0].created_at);
      const messagesPerMinute = (recentMessages.length / (timeSpan / (1000 * 60))) || 0;
      
      if (messagesPerMinute > 5) {
        indicators.isSpam = true;
        indicators.confidence += 25;
        indicators.reasons.push(`Fréquence suspecte (${Math.round(messagesPerMinute)} msg/min)`);
      }
    }
  }

  // 8. Vérifier le nom d'utilisateur suspect
  const username = user.username.toLowerCase();
  if (/\d{4,}/.test(username) || /bot|spam|test/i.test(username)) {
    indicators.confidence += 20;
    indicators.reasons.push('Nom d\'utilisateur suspect');
  }

  // Déterminer si c'est un bot/spam basé sur la confiance
  if (indicators.confidence >= 50) {
    indicators.isSpam = true;
  }

  return indicators;
}

/**
 * Analyse le taux de spam dans un canal
 */
export async function analyzeChannelSpam(guildId, channelId, supabase, timeWindowHours = 24) {
  const timeWindow = new Date();
  timeWindow.setHours(timeWindow.getHours() - timeWindowHours);

  // Récupérer les messages récents du canal
  const { data: messages, error } = await supabase
    .from('messages')
    .select('author_id, content, created_at')
    .eq('guild_id', guildId)
    .eq('channel_id', channelId)
    .gte('created_at', timeWindow.toISOString())
    .order('created_at', { ascending: false });

  if (error || !messages || messages.length === 0) {
    return {
      spamRate: 0,
      suspiciousUsers: [],
      totalMessages: 0,
    };
  }

  // Grouper par auteur
  const authorMessages = {};
  messages.forEach(msg => {
    if (!authorMessages[msg.author_id]) {
      authorMessages[msg.author_id] = [];
    }
    authorMessages[msg.author_id].push(msg);
  });

  // Analyser chaque auteur
  const suspiciousUsers = [];
  let spamMessages = 0;

  for (const [authorId, authorMsgs] of Object.entries(authorMessages)) {
    // Vérifier les patterns de spam
    const uniqueMessages = new Set(authorMsgs.map(m => m.content.toLowerCase().trim()));
    const repetitionRate = 1 - (uniqueMessages.size / authorMsgs.length);

    // Vérifier la fréquence
    const timeSpan = new Date(authorMsgs[0].created_at) - 
                     new Date(authorMsgs[authorMsgs.length - 1].created_at);
    const messagesPerMinute = authorMsgs.length / (Math.max(timeSpan, 60000) / (1000 * 60));

    if (repetitionRate > 0.6 || messagesPerMinute > 3) {
      spamMessages += authorMsgs.length;
      suspiciousUsers.push({
        author_id: authorId,
        message_count: authorMsgs.length,
        repetition_rate: Math.round(repetitionRate * 100),
        messages_per_minute: Math.round(messagesPerMinute * 10) / 10,
      });
    }
  }

  const spamRate = messages.length > 0 ? (spamMessages / messages.length) * 100 : 0;

  return {
    spamRate: Math.round(spamRate * 10) / 10,
    suspiciousUsers: suspiciousUsers.slice(0, 10), // Top 10
    totalMessages: messages.length,
  };
}

/**
 * Détecte les spikes anormaux d'activité
 */
export async function detectActivitySpike(guildId, supabase, timeWindowHours = 1) {
  const now = new Date();
  const timeWindow = new Date(now.getTime() - (timeWindowHours * 60 * 60 * 1000));
  const previousWindow = new Date(timeWindow.getTime() - (timeWindowHours * 60 * 60 * 1000));

  // Compter les messages dans la fenêtre actuelle
  const { count: currentCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('guild_id', guildId)
    .gte('created_at', timeWindow.toISOString())
    .lt('created_at', now.toISOString());

  // Compter les messages dans la fenêtre précédente
  const { count: previousCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('guild_id', guildId)
    .gte('created_at', previousWindow.toISOString())
    .lt('created_at', timeWindow.toISOString());

  const current = currentCount || 0;
  const previous = previousCount || 0;

  if (previous === 0) {
    return {
      isSpike: false,
      increase: 0,
      currentMessages: current,
      previousMessages: previous,
    };
  }

  const increase = ((current - previous) / previous) * 100;
  const isSpike = increase > 50; // Plus de 50% d'augmentation

  return {
    isSpike,
    increase: Math.round(increase * 10) / 10,
    currentMessages: current,
    previousMessages: previous,
    threshold: 50,
  };
}

/**
 * Récupère les statistiques de détection de bots pour un serveur
 */
export async function getBotDetectionStats(guildId, supabase) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Récupérer tous les messages récents
  const { data: messages } = await supabase
    .from('messages')
    .select('author_id, author_username, created_at')
    .eq('guild_id', guildId)
    .gte('created_at', sevenDaysAgo.toISOString());

  if (!messages || messages.length === 0) {
    return {
      totalUsers: 0,
      suspiciousUsers: 0,
      spamRate: 0,
      recentAccounts: 0,
    };
  }

  // Grouper par auteur
  const authorData = {};
  messages.forEach(msg => {
    if (!authorData[msg.author_id]) {
      authorData[msg.author_id] = {
        username: msg.author_username,
        messageCount: 0,
        firstSeen: new Date(msg.created_at),
      };
    }
    authorData[msg.author_id].messageCount++;
    const msgDate = new Date(msg.created_at);
    if (msgDate < authorData[msg.author_id].firstSeen) {
      authorData[msg.author_id].firstSeen = msgDate;
    }
  });

  // Analyser les comptes suspects
  let suspiciousUsers = 0;
  let recentAccounts = 0;
  const now = new Date();

  for (const [authorId, data] of Object.entries(authorData)) {
    const accountAge = now - data.firstSeen;
    const daysOld = accountAge / (1000 * 60 * 60 * 24);

    // Compte récent (< 7 jours) avec beaucoup de messages
    if (daysOld < 7 && data.messageCount > 10) {
      recentAccounts++;
      suspiciousUsers++;
    }

    // Beaucoup de messages en peu de temps (spam)
    if (data.messageCount > 50 && daysOld < 1) {
      suspiciousUsers++;
    }
  }

  const spamRate = messages.length > 0 ? (suspiciousUsers / Object.keys(authorData).length) * 100 : 0;

  return {
    totalUsers: Object.keys(authorData).length,
    suspiciousUsers,
    spamRate: Math.round(spamRate * 10) / 10,
    recentAccounts,
    totalMessages: messages.length,
  };
}

/**
 * Calcule un score de confiance pour un utilisateur (0-100)
 */
export async function calculateTrustScore(userId, guildId, supabase, guild) {
  let score = 50; // Score de base
  const reasons = [];

  try {
    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) {
      return {
        score: 0,
        reasons: [{ positive: false, reason: 'Membre introuvable dans le serveur' }],
      };
    }

    const user = member.user;

    // 1. Âge du compte
    const accountAge = Date.now() - user.createdTimestamp;
    const daysOld = accountAge / (1000 * 60 * 60 * 24);

    if (daysOld > 365) {
      score += 20;
      reasons.push({ positive: true, reason: `Compte créé il y a ${Math.round(daysOld)} jours (> 1 an)` });
    } else if (daysOld > 180) {
      score += 10;
      reasons.push({ positive: true, reason: `Compte créé il y a ${Math.round(daysOld)} jours (> 6 mois)` });
    } else if (daysOld < 7) {
      score -= 30;
      reasons.push({ positive: false, reason: `Compte créé il y a ${Math.round(daysOld)} jours (< 7 jours)` });
    }

    // 2. Avatar
    if (user.avatar) {
      score += 10;
      reasons.push({ positive: true, reason: 'Avatar personnalisé' });
    } else {
      score -= 10;
      reasons.push({ positive: false, reason: 'Pas d\'avatar personnalisé' });
    }

    // 3. Historique des messages
    const { data: userMessages } = await supabase
      .from('messages')
      .select('content, created_at, is_reply, reaction_count')
      .eq('guild_id', guildId)
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (userMessages && userMessages.length > 0) {
      score += 15;
      reasons.push({ positive: true, reason: `${userMessages.length} messages récents dans le serveur` });

      // Vérifier la diversité des messages
      const uniqueMessages = new Set(userMessages.map(m => m.content.toLowerCase().trim()));
      const repetitionRate = 1 - (uniqueMessages.size / userMessages.length);

      if (repetitionRate < 0.3) {
        score += 10;
        reasons.push({ positive: true, reason: 'Messages variés (faible répétition)' });
      } else if (repetitionRate > 0.7) {
        score -= 20;
        reasons.push({ positive: false, reason: `Taux de répétition élevé (${Math.round(repetitionRate * 100)}%)` });
      }

      // Vérifier les réponses (engagement)
      const replies = userMessages.filter(m => m.is_reply).length;
      if (replies > userMessages.length * 0.3) {
        score += 10;
        reasons.push({ positive: true, reason: 'Bon taux de réponses aux messages' });
      }

      // Vérifier les réactions reçues
      const totalReactions = userMessages.reduce((sum, m) => sum + (m.reaction_count || 0), 0);
      if (totalReactions > userMessages.length * 0.5) {
        score += 10;
        reasons.push({ positive: true, reason: 'Messages bien reçus par la communauté' });
      }
    } else {
      score -= 15;
      reasons.push({ positive: false, reason: 'Aucun message récent dans le serveur' });
    }

    // 4. Nom d'utilisateur suspect
    const username = user.username.toLowerCase();
    if (/\d{4,}/.test(username) || /bot|spam|test|fake/i.test(username)) {
      score -= 15;
      reasons.push({ positive: false, reason: 'Nom d\'utilisateur suspect' });
    }

    // 5. Vérifier si c'est un bot Discord officiel
    if (user.bot) {
      score = 0;
      reasons.push({ positive: false, reason: 'Compte bot Discord officiel' });
    }

    // 6. Vérifier l'activité récente
    if (userMessages && userMessages.length > 0) {
      const lastMessage = new Date(userMessages[0].created_at);
      const daysSinceLastMessage = (Date.now() - lastMessage.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceLastMessage < 1) {
        score += 5;
        reasons.push({ positive: true, reason: 'Actif récemment' });
      } else if (daysSinceLastMessage > 30) {
        score -= 10;
        reasons.push({ positive: false, reason: `Inactif depuis ${Math.round(daysSinceLastMessage)} jours` });
      }
    }

    // Normaliser le score entre 0 et 100
    score = Math.max(0, Math.min(100, score));

    return {
      score: Math.round(score),
      reasons,
    };
  } catch (error) {
    console.error('Erreur calcul trust score:', error);
    return {
      score: 50,
      reasons: [{ positive: false, reason: 'Erreur lors du calcul du score' }],
    };
  }
}

