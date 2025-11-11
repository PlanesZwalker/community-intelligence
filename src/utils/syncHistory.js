/**
 * Synchronise l'historique des messages depuis Discord vers Supabase
 * Récupère les messages passés des canaux accessibles au bot
 */

export async function syncHistory(client, supabase, options = {}) {
  const {
    limit = 100, // Nombre de messages par canal à récupérer
    maxChannels = 50, // Nombre maximum de canaux à traiter
    delayBetweenChannels = 1000, // Délai en ms entre chaque canal (pour éviter rate limit)
  } = options;

  const stats = {
    guilds: 0,
    channels: 0,
    messages: 0,
    errors: 0,
  };

  try {
    console.log('🔄 Début de la synchronisation de l\'historique...');
    
    // Parcourir tous les serveurs où le bot est présent
    for (const [guildId, guild] of client.guilds.cache) {
      stats.guilds++;
      console.log(`📊 Traitement du serveur: ${guild.name} (${guildId})`);

      try {
        // Récupérer tous les canaux textuels du serveur
        // Filtrer les canaux textuels (pas de DM, pas de threads)
        const textChannels = guild.channels.cache.filter(
          channel => channel.isTextBased() && !channel.isDMBased() && !channel.isThread()
        );

        let channelCount = 0;
        for (const [channelId, channel] of textChannels) {
          if (channelCount >= maxChannels) {
            console.log(`   ⚠️ Limite de ${maxChannels} canaux atteinte pour ce serveur`);
            break;
          }

          try {
            // Vérifier que le bot a la permission de lire l'historique
            const permissions = channel.permissionsFor(client.user);
            if (!permissions || !permissions.has('ReadMessageHistory')) {
              console.log(`   ⏭️ Canal ${channel.name}: pas de permission ReadMessageHistory`);
              continue;
            }

            console.log(`   📥 Récupération de l'historique: #${channel.name} (${channelId})`);

            // Récupérer les messages (les plus récents en premier)
            const messages = await channel.messages.fetch({ limit });

            if (messages.size === 0) {
              console.log(`      ℹ️ Aucun message dans ce canal`);
              continue;
            }

            // Préparer les données pour l'insertion en batch
            const messagesToInsert = [];
            let inserted = 0;
            let duplicates = 0;

            for (const [messageId, message] of messages) {
              // Ignorer les messages de bots
              if (message.author.bot) continue;

              // Vérifier si le message existe déjà dans la base
              const { data: existing } = await supabase
                .from('messages')
                .select('message_id')
                .eq('message_id', messageId)
                .single();

              if (existing) {
                duplicates++;
                continue;
              }

              messagesToInsert.push({
                message_id: message.id,
                guild_id: guild.id,
                channel_id: channel.id,
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
              });
            }

            // Insérer les messages en batch (par groupes de 100 pour éviter les limites)
            if (messagesToInsert.length > 0) {
              const batchSize = 100;
              for (let i = 0; i < messagesToInsert.length; i += batchSize) {
                const batch = messagesToInsert.slice(i, i + batchSize);
                const { error } = await supabase
                  .from('messages')
                  .insert(batch);

                if (error && error.code !== '23505') { // Ignorer les doublons
                  console.error(`      ❌ Erreur insertion batch:`, error.message);
                  stats.errors++;
                } else {
                  inserted += batch.length;
                }
              }

              console.log(`      ✅ ${inserted} messages insérés, ${duplicates} déjà présents`);
              stats.messages += inserted;
            } else if (duplicates > 0) {
              console.log(`      ℹ️ ${duplicates} messages déjà présents dans la base`);
            }

            stats.channels++;

            // Délai entre les canaux pour éviter le rate limit
            if (delayBetweenChannels > 0) {
              await new Promise(resolve => setTimeout(resolve, delayBetweenChannels));
            }
          } catch (channelError) {
            console.error(`      ❌ Erreur sur le canal ${channel.name}:`, channelError.message);
            stats.errors++;
          }
        }
      } catch (guildError) {
        console.error(`❌ Erreur sur le serveur ${guild.name}:`, guildError.message);
        stats.errors++;
      }
    }

    console.log('✅ Synchronisation terminée!');
    console.log(`   📊 Statistiques:`);
    console.log(`      - Serveurs traités: ${stats.guilds}`);
    console.log(`      - Canaux traités: ${stats.channels}`);
    console.log(`      - Messages insérés: ${stats.messages}`);
    console.log(`      - Erreurs: ${stats.errors}`);

    return stats;
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
    throw error;
  }
}

