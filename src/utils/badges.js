/**
 * Système de Badges Visuels
 * Attribue des badges basés sur des achievements spécifiques
 */

/**
 * Vérifie et attribue des badges à un utilisateur
 */
export async function checkAndAwardBadges(userId, guildId, supabase, guild) {
  const badges = [];

  try {
    // Récupérer les données du membre
    const { data: xpProfile } = await supabase
      .from('member_xp')
      .select('*')
      .eq('user_id', userId)
      .eq('guild_id', guildId)
      .single();

    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('guild_id', guildId)
      .eq('author_id', userId);

    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) return badges;

    const accountAge = Date.now() - member.user.createdTimestamp;
    const daysOld = accountAge / (1000 * 60 * 60 * 24);
    const joinedAt = member.joinedTimestamp;
    const daysInGuild = joinedAt ? (Date.now() - joinedAt) / (1000 * 60 * 60 * 24) : 0;

    // Badge: First Blood
    if (messages && messages.length >= 1) {
      badges.push({
        id: 'first_blood',
        name: 'First Blood',
        emoji: '🩸',
        description: 'Envoie ton premier message',
      });
    }

    // Badge: Helper
    const replies = messages?.filter(m => m.is_reply).length || 0;
    if (replies >= 10) {
      badges.push({
        id: 'helper',
        name: 'Helper',
        emoji: '🤝',
        description: 'Réponds à 10 questions',
      });
    }

    // Badge: Chatterbox
    if (messages && messages.length >= 100) {
      badges.push({
        id: 'chatterbox',
        name: 'Chatterbox',
        emoji: '💬',
        description: 'Envoie 100 messages',
      });
    }

    // Badge: Legend
    if (xpProfile && xpProfile.level >= 50) {
      badges.push({
        id: 'legend',
        name: 'Legend',
        emoji: '🏆',
        description: 'Atteins le niveau 50',
      });
    }

    // Badge: OG
    if (daysInGuild >= 365) {
      badges.push({
        id: 'og',
        name: 'OG',
        emoji: '👴',
        description: 'Membre depuis 1 an',
      });
    }

    // Badge: Veteran
    if (daysOld >= 730) {
      badges.push({
        id: 'veteran',
        name: 'Veteran',
        emoji: '🎖️',
        description: 'Compte Discord créé il y a 2+ ans',
      });
    }

    // Badge: Social Butterfly
    const uniqueChannels = new Set(messages?.map(m => m.channel_id) || []);
    if (uniqueChannels.size >= 10) {
      badges.push({
        id: 'social_butterfly',
        name: 'Social Butterfly',
        emoji: '🦋',
        description: 'Actif dans 10+ canaux',
      });
    }

    // Badge: Question Master
    const questions = messages?.filter(m => m.is_question).length || 0;
    if (questions >= 20) {
      badges.push({
        id: 'question_master',
        name: 'Question Master',
        emoji: '❓',
        description: 'Pose 20 questions',
      });
    }

    return badges;
  } catch (error) {
    console.error('Erreur vérification badges:', error);
    return badges;
  }
}

/**
 * Récupère tous les badges d'un utilisateur
 */
export async function getUserBadges(userId, guildId, supabase, guild) {
  return await checkAndAwardBadges(userId, guildId, supabase, guild);
}

