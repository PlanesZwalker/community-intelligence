/**
 * Système d'Onboarding Automatique Intelligent
 * Analyse les premiers messages d'un nouveau membre et suggère des rôles/canaux
 */

import { generateWithGroq } from './aiService.js';

/**
 * Analyse les centres d'intérêt d'un nouveau membre basés sur ses premiers messages
 */
export async function analyzeNewMemberInterests(userId, guildId, supabase, guild) {
  try {
    // Récupérer les 10 premiers messages du membre
    const { data: messages } = await supabase
      .from('messages')
      .select('content, channel_id')
      .eq('guild_id', guildId)
      .eq('author_id', userId)
      .order('created_at', { ascending: true })
      .limit(10);

    if (!messages || messages.length === 0) {
      return {
        interests: [],
        suggestedChannels: [],
        suggestedRoles: [],
      };
    }

    // Analyser avec IA
    const messageText = messages.map(m => m.content).join('\n');
    const prompt = `Analyse ces premiers messages Discord d'un nouveau membre et identifie ses centres d'intérêt.

Messages:
${messageText}

Réponds UNIQUEMENT avec une liste de mots-clés séparés par des virgules (ex: python, gaming, art, music). Maximum 5 mots-clés:`;

    try {
      const aiResponse = await generateWithGroq(prompt, 100);
      const interests = aiResponse
        .split(',')
        .map(i => i.trim().toLowerCase())
        .filter(i => i.length > 0)
        .slice(0, 5);

      // Trouver des canaux correspondants
      const suggestedChannels = [];
      const suggestedRoles = [];

      // Chercher des canaux avec des noms similaires aux intérêts
      guild.channels.cache.forEach(channel => {
        if (!channel.isTextBased() || channel.isDMBased()) return;

        const channelName = channel.name.toLowerCase();
        interests.forEach(interest => {
          if (channelName.includes(interest) && !suggestedChannels.includes(channel.id)) {
            suggestedChannels.push(channel.id);
          }
        });
      });

      // Chercher des rôles correspondants
      guild.roles.cache.forEach(role => {
        if (role.managed || role.name === '@everyone') return;

        const roleName = role.name.toLowerCase();
        interests.forEach(interest => {
          if (roleName.includes(interest) && !suggestedRoles.includes(role.id)) {
            suggestedRoles.push(role.id);
          }
        });
      });

      return {
        interests,
        suggestedChannels: suggestedChannels.slice(0, 5),
        suggestedRoles: suggestedRoles.slice(0, 3),
      };
    } catch (error) {
      console.error('Erreur analyse IA onboarding:', error);
      return {
        interests: [],
        suggestedChannels: [],
        suggestedRoles: [],
      };
    }
  } catch (error) {
    console.error('Erreur analyse nouveau membre:', error);
    return {
      interests: [],
      suggestedChannels: [],
      suggestedRoles: [],
    };
  }
}

/**
 * Envoie un message de bienvenue personnalisé à un nouveau membre
 */
export async function sendWelcomeMessage(member, interests, suggestedChannels, suggestedRoles, guild) {
  try {
    const channelsText = suggestedChannels.length > 0
      ? suggestedChannels.map(id => `<#${id}>`).join(', ')
      : 'les canaux généraux';

    const rolesText = suggestedRoles.length > 0
      ? suggestedRoles.map(id => `<@&${id}>`).join(', ')
      : null;

    let message = `👋 Bienvenue ${member.user} sur **${guild.name}** !\n\n`;

    if (interests.length > 0) {
      message += `J'ai remarqué que tu t'intéresses à : **${interests.join(', ')}**\n\n`;
    }

    if (suggestedChannels.length > 0) {
      message += `💬 Voici des canaux qui pourraient t'intéresser : ${channelsText}\n\n`;
    }

    if (rolesText) {
      message += `🎭 Veux-tu le rôle ${rolesText} ? Réagis avec ✅ pour l'obtenir !\n\n`;
    }

    message += `🎯 Ta première quête : Présente-toi dans #introductions\nRécompense : +25 XP`;

    // Envoyer en DM
    await member.send(message).catch(() => {
      // Si les DMs sont désactivés, envoyer dans un canal de bienvenue
      const welcomeChannel = guild.channels.cache.find(
        c => c.isTextBased() && (c.name.includes('welcome') || c.name.includes('bienvenue') || c.name.includes('général'))
      );

      if (welcomeChannel) {
        welcomeChannel.send(message).catch(() => {});
      }
    });
  } catch (error) {
    console.error('Erreur envoi message bienvenue:', error);
  }
}

