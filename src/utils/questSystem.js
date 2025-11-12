/**
 * Système de Quêtes Personnalisées
 * Génère des quêtes quotidiennes basées sur l'IA pour chaque membre
 */

import { generateWithGroq } from './aiService.js';

/**
 * Génère une quête personnalisée pour un utilisateur
 */
export async function generatePersonalQuest(userId, guildId, supabase, guild) {
  try {
    // Récupérer l'historique du membre
    const { data: userMessages } = await supabase
      .from('messages')
      .select('content, channel_id, created_at')
      .eq('guild_id', guildId)
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    // Récupérer le profil XP
    const { data: xpProfile } = await supabase
      .from('member_xp')
      .select('*')
      .eq('user_id', userId)
      .eq('guild_id', guildId)
      .single();

    // Analyser les canaux peu actifs
    const { data: allChannels } = await supabase
      .from('messages')
      .select('channel_id')
      .eq('guild_id', guildId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const channelActivity = {};
    allChannels?.forEach(msg => {
      channelActivity[msg.channel_id] = (channelActivity[msg.channel_id] || 0) + 1;
    });

    const leastActiveChannels = Object.entries(channelActivity)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3)
      .map(([id]) => id);

    // Générer la quête avec IA
    const context = {
      userLevel: xpProfile?.level || 1,
      userXP: xpProfile?.xp || 0,
      recentMessages: userMessages?.length || 0,
      leastActiveChannels: leastActiveChannels.length,
    };

    const prompt = `Génère une quête Discord personnalisée pour un membre de niveau ${context.userLevel} avec ${context.userXP} XP.

**Contexte:**
- Niveau actuel: ${context.userLevel}
- Messages récents: ${context.recentMessages}
- Canaux peu actifs détectés: ${context.leastActiveChannels}

**Instructions:**
Génère exactement 3 quêtes courtes et actionnables (une par ligne, format: "emoji description") qui:
1. Augmentent l'engagement dans les canaux peu actifs
2. Sont adaptées au niveau du membre
3. Sont réalisables en une journée

**Format de réponse:**
📝 Réponds à 2 questions dans #help
💬 Crée un thread dans #discussions
🎨 Partage un meme dans #fun

Réponds UNIQUEMENT avec les 3 quêtes, rien d'autre:`;

    const aiResponse = await generateWithGroq(prompt, 200);
    const quests = aiResponse
      .split('\n')
      .filter(line => line.trim().length > 0)
      .slice(0, 3)
      .map(line => line.trim());

    return {
      quests,
      rewards: {
        xp: 50,
        role: null, // Peut être configuré
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    };
  } catch (error) {
    console.error('Erreur génération quête:', error);
    // Fallback: quêtes génériques
    return {
      quests: [
        '📝 Envoie 5 messages aujourd\'hui',
        '💬 Réponds à une question',
        '🎉 Partage quelque chose dans #général',
      ],
      rewards: {
        xp: 50,
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }
}

/**
 * Vérifie la complétion d'une quête
 */
export async function checkQuestCompletion(userId, guildId, questId, supabase) {
  // À implémenter: vérifier si les actions de la quête sont complétées
  // Pour l'instant, placeholder
  return { completed: false, progress: 0 };
}

