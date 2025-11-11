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
  } catch (error) {
    console.error('Erreur dans messageHandler:', error);
  }
}

