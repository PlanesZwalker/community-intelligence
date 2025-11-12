import { addXP, getXPConfig } from '../utils/xpSystem.js';

/**
 * Gère la collecte et le stockage des messages
 */
export async function messageHandler(message, supabase) {
  try {
    // Ignorer les messages dans les DMs
    if (!message.guild) return;

    // Préparer les données du message
    const messageData = {
      message_id: message.id,
      guild_id: message.guild.id,
      channel_id: message.channel.id,
      author_id: message.author.id,
      author_username: message.author.username,
      author_display_name: message.author.displayName || message.author.username,
      content: message.content.substring(0, 2000), // Limite Discord
      created_at: message.createdAt.toISOString(),
      has_attachments: message.attachments.size > 0,
      has_embeds: message.embeds.length > 0,
      reaction_count: message.reactions.cache.size,
      is_question: message.content.includes('?'),
      is_reply: message.reference !== null,
    };

    // Insérer dans la base de données
    const { error } = await supabase
      .from('messages')
      .insert(messageData);

    if (error && error.code !== '23505') { // Ignorer les doublons (code 23505)
      console.error('Erreur lors de l\'insertion du message:', error);
    }

    // Ajouter de l'XP si le système est activé
    try {
      const xpConfig = await getXPConfig(message.guild.id, supabase);
      if (xpConfig && xpConfig.enabled) {
        let xpAmount = xpConfig.xp_per_message || 1;
        let reason = 'message';

        // Bonus pour les questions
        if (messageData.is_question) {
          xpAmount += xpConfig.xp_per_question || 5;
          reason = 'question';
        }

        // Bonus pour les réponses
        if (messageData.is_reply) {
          xpAmount += xpConfig.xp_per_reply || 3;
          reason = 'reply';
        }

        // Bonus pour les réactions
        if (messageData.reaction_count > 0) {
          xpAmount += (xpConfig.xp_per_reaction || 1) * messageData.reaction_count;
        }

        const xpResult = await addXP(
          message.author.id,
          message.guild.id,
          xpAmount,
          supabase,
          reason
        );

        // Si l'utilisateur a monté de niveau, on pourrait envoyer un message
        // (optionnel, pour ne pas spammer)
        if (xpResult && xpResult.levelUp) {
          // Optionnel : envoyer un message de félicitation
          // await message.channel.send(
          //   `🎉 Félicitations <@${message.author.id}> ! Tu es maintenant niveau ${xpResult.newLevel} !`
          // );
        }
      }
    } catch (xpError) {
      // Ne pas bloquer le traitement du message si l'XP échoue
      console.error('Erreur lors de l\'ajout d\'XP:', xpError);
    }
  } catch (error) {
    console.error('Erreur dans messageHandler:', error);
  }
}

