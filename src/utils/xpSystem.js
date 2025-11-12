/**
 * Système de gamification XP/Levels
 * Gère l'attribution d'XP, le calcul des niveaux, et les récompenses
 */

/**
 * Calcule le niveau à partir de l'XP
 * Formule : level = floor(sqrt(xp / 100))
 * Niveau 1 = 0-99 XP, Niveau 2 = 100-399 XP, Niveau 3 = 400-899 XP, etc.
 */
export function calculateLevel(xp) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * Calcule l'XP nécessaire pour atteindre un niveau donné
 */
export function xpForLevel(level) {
  return Math.pow(level - 1, 2) * 100;
}

/**
 * Calcule l'XP nécessaire pour le prochain niveau
 */
export function xpForNextLevel(currentXP) {
  const currentLevel = calculateLevel(currentXP);
  const nextLevelXP = xpForLevel(currentLevel + 1);
  return nextLevelXP - currentXP;
}

/**
 * Récupère ou crée un profil XP pour un utilisateur
 */
export async function getOrCreateXPProfile(userId, guildId, supabase) {
  const { data, error } = await supabase
    .from('member_xp')
    .select('*')
    .eq('user_id', userId)
    .eq('guild_id', guildId)
    .single();

  if (error && error.code === 'PGRST116') {
    // Pas de profil existant, en créer un
    const newProfile = {
      user_id: userId,
      guild_id: guildId,
      xp: 0,
      level: 1,
      total_messages: 0,
      questions_answered: 0,
    };

    const { data: created, error: createError } = await supabase
      .from('member_xp')
      .insert(newProfile)
      .select()
      .single();

    if (createError) {
      console.error('Erreur lors de la création du profil XP:', createError);
      return null;
    }

    return created;
  }

  if (error) {
    console.error('Erreur lors de la récupération du profil XP:', error);
    return null;
  }

  return data;
}

/**
 * Ajoute de l'XP à un utilisateur
 */
export async function addXP(userId, guildId, amount, supabase, reason = 'message') {
  try {
    // Vérifier le cooldown pour éviter le spam
    const profile = await getOrCreateXPProfile(userId, guildId, supabase);
    if (!profile) return null;

    const config = await getXPConfig(guildId, supabase);
    const cooldown = config?.cooldown_seconds || 60;

    // Vérifier le cooldown (si le dernier message est trop récent, ignorer)
    if (profile.last_message_at) {
      const lastMessage = new Date(profile.last_message_at);
      const now = new Date();
      const secondsSinceLastMessage = (now - lastMessage) / 1000;

      if (secondsSinceLastMessage < cooldown) {
        return null; // Trop tôt, ignorer
      }
    }

    // Ajouter l'XP
    const newXP = profile.xp + amount;
    const newLevel = calculateLevel(newXP);

    const updateData = {
      xp: newXP,
      level: newLevel,
      last_message_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Mettre à jour le compteur de messages si c'est un message normal
    if (reason === 'message') {
      updateData.total_messages = (profile.total_messages || 0) + 1;
    } else if (reason === 'question') {
      updateData.questions_answered = (profile.questions_answered || 0) + 1;
    }

    const { data, error } = await supabase
      .from('member_xp')
      .update(updateData)
      .eq('user_id', userId)
      .eq('guild_id', guildId)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de l\'ajout d\'XP:', error);
      return null;
    }

    // Vérifier si l'utilisateur a monté de niveau
    if (newLevel > profile.level) {
      return {
        ...data,
        levelUp: true,
        oldLevel: profile.level,
        newLevel: newLevel,
      };
    }

    return data;
  } catch (error) {
    console.error('Erreur dans addXP:', error);
    return null;
  }
}

/**
 * Récupère la configuration XP d'un serveur
 */
export async function getXPConfig(guildId, supabase) {
  const { data, error } = await supabase
    .from('guild_xp_config')
    .select('*')
    .eq('guild_id', guildId)
    .single();

  if (error && error.code === 'PGRST116') {
    // Pas de config, créer une config par défaut
    const defaultConfig = {
      guild_id: guildId,
      xp_per_message: 1,
      xp_per_question: 5,
      xp_per_reply: 3,
      xp_per_reaction: 1,
      cooldown_seconds: 60,
      enabled: true,
    };

    const { data: created, error: createError } = await supabase
      .from('guild_xp_config')
      .insert(defaultConfig)
      .select()
      .single();

    if (createError) {
      console.error('Erreur lors de la création de la config XP:', createError);
      return defaultConfig; // Retourner la config par défaut même en cas d'erreur
    }

    return created;
  }

  if (error) {
    console.error('Erreur lors de la récupération de la config XP:', error);
    return null;
  }

  return data;
}

/**
 * Récupère le leaderboard d'un serveur
 */
export async function getLeaderboard(guildId, supabase, limit = 10) {
  const { data, error } = await supabase
    .from('member_xp')
    .select('user_id, xp, level, total_messages, questions_answered')
    .eq('guild_id', guildId)
    .order('xp', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erreur lors de la récupération du leaderboard:', error);
    return [];
  }

  return data || [];
}

/**
 * Récupère le classement d'un utilisateur dans le leaderboard
 */
export async function getUserRank(userId, guildId, supabase) {
  // Compter combien d'utilisateurs ont plus d'XP que cet utilisateur
  const profile = await getOrCreateXPProfile(userId, guildId, supabase);
  if (!profile) return null;

  const { count, error } = await supabase
    .from('member_xp')
    .select('*', { count: 'exact', head: true })
    .eq('guild_id', guildId)
    .gt('xp', profile.xp);

  if (error) {
    console.error('Erreur lors du calcul du rang:', error);
    return null;
  }

  return (count || 0) + 1; // Rang = nombre de personnes devant + 1
}

