import { EmbedBuilder } from 'discord.js';
import { getStats } from '../utils/analytics.js';
import { getWeeklySummary } from '../utils/weeklySummary.js';
import { generateEngagementRecommendations } from '../utils/aiService.js';
import { syncHistory } from '../utils/syncHistory.js';
import { getOrCreateXPProfile, getLeaderboard, getUserRank, xpForNextLevel, calculateLevel } from '../utils/xpSystem.js';
import { getBotDetectionStats, analyzeChannelSpam, detectActivitySpike } from '../utils/botDetection.js';
import { createChannelCounter, deleteChannelCounter, getGuildCounters, updateAllChannelCounters } from '../utils/channelCounters.js';
import { analyzeChannelSentiment, analyzeGuildSentiment } from '../utils/sentimentAnalysis.js';
import { generatePredictions } from '../utils/predictions.js';
import { generatePersonalQuest } from '../utils/questSystem.js';
import { getVoiceStats } from '../utils/voiceAnalytics.js';
import { calculateTrustScore } from '../utils/botDetection.js';
import { getUserBadges } from '../utils/badges.js';
import { createCheckoutSession, createBillingPortal } from '../utils/stripe.js';
import { getGuildPlan, hasFeature, checkLimit, getLimitErrorMessage } from '../utils/premium.js';

/**
 * Gère les commandes slash
 */
export async function commandHandler(interaction, client) {
  // Vérifier que c'est bien une interaction valide
  if (!interaction || typeof interaction.commandName !== 'string') {
    console.error('❌ Interaction invalide reçue:', interaction);
    return;
  }

  console.log(`📝 Commande reçue: /${interaction.commandName}`);
  console.log(`   Commandes disponibles: ${Array.from(client.commands.keys()).join(', ')}`);

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.warn(`⚠️ Commande non trouvée: ${interaction.commandName}`);
    console.warn(`   Commandes enregistrées: ${Array.from(client.commands.keys()).join(', ')}`);
    if (interaction.isRepliable()) {
      return interaction.reply({
        content: '❌ Commande non trouvée',
        ephemeral: true,
      }).catch(err => console.error('Erreur lors de la réponse:', err));
    }
    return;
  }

  console.log(`✅ Commande trouvée, exécution...`);

  try {
    await command.execute(interaction, client);
    console.log(`✅ Commande /${interaction.commandName} exécutée avec succès`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'exécution de ${interaction.commandName}:`, error);
    
    // Vérifier que l'interaction peut encore répondre
    if (!interaction.isRepliable()) {
      console.error('❌ Interaction ne peut plus répondre');
      return;
    }

    const errorMessage = {
      content: '❌ Une erreur est survenue lors de l\'exécution de cette commande.',
      ephemeral: true,
    };

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    } catch (replyError) {
      console.error('❌ Impossible d\'envoyer le message d\'erreur:', replyError);
    }
  }
}

// Définir les commandes
export const commands = [
  {
    name: 'ci-stats',
    description: 'Affiche les statistiques de votre serveur (Community Intelligence)',
    execute: async (interaction, client) => {
      await interaction.deferReply();

      const stats = await getStats(interaction.guild.id, client.supabase);

      const embed = new EmbedBuilder()
        .setTitle('📊 Statistiques du serveur')
        .setColor(0x5865F2)
        .addFields(
          { name: '💬 Messages totaux', value: stats.totalMessages.toString(), inline: true },
          { name: '👥 Membres actifs', value: stats.activeMembers.toString(), inline: true },
          { name: '📝 Canaux actifs', value: stats.activeChannels.toString(), inline: true },
          { name: '❓ Questions posées', value: stats.totalQuestions.toString(), inline: true },
          { name: '💭 Taux de réponse', value: `${stats.answerRate}%`, inline: true },
          { name: '🔥 Messages populaires', value: stats.popularMessages.toString(), inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Community Intelligence Bot' });

      await interaction.editReply({ embeds: [embed] });
    },
  },
  {
    name: 'ci-weekly-summary',
    description: 'Génère un résumé hebdomadaire de l\'activité (Community Intelligence)',
    execute: async (interaction, client) => {
      await interaction.deferReply();

      // Utilise l'IA si disponible
      const useAI = !!process.env.GROQ_API_KEY;
      const summary = await getWeeklySummary(interaction.guild.id, client.supabase, useAI);

      const embed = new EmbedBuilder()
        .setTitle('📅 Résumé hebdomadaire')
        .setColor(0x57F287)
        .setDescription(summary.description)
        .addFields(
          { name: '🏆 Top 3 membres actifs', value: summary.topMembers, inline: false },
          { name: '📢 Canaux les plus actifs', value: summary.topChannels, inline: false },
          { name: '❓ Questions sans réponse', value: summary.unansweredQuestions || 'Aucune', inline: false }
        )
        .setTimestamp()
        .setFooter({ text: 'Community Intelligence Bot' });

      // Ajouter le résumé IA si disponible
      if (summary.aiSummary) {
        embed.addFields({
          name: '🤖 Analyse IA',
          value: summary.aiSummary.substring(0, 1024), // Limite Discord
          inline: false,
        });
      }

      await interaction.editReply({ embeds: [embed] });
    },
  },
  {
    name: 'ci-ai-summary',
    description: 'Génère un résumé intelligent avec IA (nécessite clé API)',
    execute: async (interaction, client) => {
      console.log('🤖 Commande /ci-ai-summary exécutée');
      console.log(`   Serveur: ${interaction.guild?.name} (${interaction.guild?.id})`);
      await interaction.deferReply();

      // Vérifier le plan premium
      const plan = await getGuildPlan(interaction.guild.id, client.supabase);
      const hasAIFeature = await hasFeature(interaction.guild.id, 'ai', client.supabase);

      if (!hasAIFeature) {
        return interaction.editReply({
          content: `❌ ${getLimitErrorMessage('aiRequests', plan?.plan_type || 'free')}`,
        });
      }

      // Vérifier les clés API disponibles
      const hasGroq = !!process.env.GROQ_API_KEY;
      const hasOpenAI = !!process.env.OPENAI_API_KEY;
      const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
      const provider = process.env.AI_PROVIDER || 'groq';
      
      console.log(`   Clés API disponibles: Groq=${hasGroq}, OpenAI=${hasOpenAI}, Anthropic=${hasAnthropic}`);
      console.log(`   Provider configuré: ${provider}`);

      if (!hasGroq && !hasOpenAI && !hasAnthropic) {
        console.log('❌ Aucune clé API IA configurée');
        return interaction.editReply({
          content: '❌ Aucune clé API IA configurée. Ajoutez `GROQ_API_KEY` dans vos variables d\'environnement.\n💡 Groq est gratuit : https://console.groq.com',
        });
      }

      console.log('📊 Génération du résumé IA...');
      try {
        const summary = await getWeeklySummary(interaction.guild.id, client.supabase, true);
        console.log('📊 Résumé généré');
        console.log(`   aiSummary existe: ${!!summary.aiSummary}`);
        console.log(`   aiSummary type: ${typeof summary.aiSummary}`);
        console.log(`   aiSummary longueur: ${summary.aiSummary?.length || 0}`);
        console.log(`   aiSummary début: ${summary.aiSummary?.substring(0, 100) || 'null'}`);

        // Vérifier si aiSummary est null, undefined, vide, ou une chaîne d'erreur
        if (!summary.aiSummary || 
            summary.aiSummary.trim() === '' || 
            summary.aiSummary.startsWith('❌')) {
          console.log('❌ Aucun résumé IA valide généré');
          console.log(`   Valeur aiSummary: "${summary.aiSummary}"`);
          
          // Vérifier s'il y a des messages dans la base
          const { data: messageCount } = await client.supabase
            .from('messages')
            .select('message_id', { count: 'exact', head: true })
            .eq('guild_id', interaction.guild.id);
          
          console.log(`   Nombre de messages dans la base: ${messageCount || 0}`);
          
          return interaction.editReply({
            content: `❌ Impossible de générer le résumé IA.\n\n**Causes possibles :**\n- Aucun message dans la base de données (${messageCount || 0} messages trouvés)\n- Erreur de l'API IA (vérifiez les logs)\n- Clé API invalide ou quota dépassé\n\n💡 Essayez d'abord `/ci-sync-history` pour synchroniser les messages.`,
          });
        }

        const embed = new EmbedBuilder()
          .setTitle('🤖 Résumé intelligent (IA)')
          .setColor(0x9B59B6)
          .setDescription(summary.aiSummary.substring(0, 4096)) // Limite Discord
          .addFields(
            { name: '📊 Stats de base', value: summary.description, inline: false }
          )
          .setTimestamp()
          .setFooter({ text: 'Community Intelligence Bot - Powered by AI' });

        await interaction.editReply({ embeds: [embed] });
        console.log('✅ Résumé IA envoyé avec succès');
      } catch (error) {
        console.error('❌ Erreur lors de la génération du résumé IA:', error);
        console.error('   Stack:', error.stack);
        await interaction.editReply({
          content: `❌ Erreur lors de la génération du résumé IA: ${error.message}\n\nVérifiez les logs pour plus de détails.`,
        });
      }
    },
  },
  {
    name: 'ci-recommendations',
    description: 'Obtient des recommandations d\'engagement basées sur l\'IA',
    execute: async (interaction, client) => {
      await interaction.deferReply();

      if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
        return interaction.editReply({
          content: '❌ Aucune clé API IA configurée. Ajoutez `GROQ_API_KEY` dans vos variables d\'environnement.\n💡 Groq est gratuit : https://console.groq.com',
        });
      }

      const stats = await getStats(interaction.guild.id, client.supabase);
      const recommendations = await generateEngagementRecommendations(stats, process.env.AI_PROVIDER || 'groq');

      const embed = new EmbedBuilder()
        .setTitle('💡 Recommandations d\'engagement')
        .setColor(0xFEE75C)
        .setDescription(recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n\n'))
        .addFields(
          { name: '📊 Contexte', value: `${stats.activeMembers} membres actifs | ${stats.totalQuestions} questions`, inline: false }
        )
        .setTimestamp()
        .setFooter({ text: 'Community Intelligence Bot - Powered by AI' });

      await interaction.editReply({ embeds: [embed] });
    },
  },
  {
    name: 'ci-sync-history',
    description: 'Synchronise l\'historique des messages depuis Discord vers la base de données',
    execute: async (interaction, client) => {
      console.log('🔄 Commande /ci-sync-history exécutée');
      console.log(`   Serveur: ${interaction.guild?.name} (${interaction.guild?.id})`);
      console.log(`   Utilisateur: ${interaction.user?.tag} (${interaction.user?.id})`);
      
      try {
        await interaction.deferReply({ ephemeral: true });
        console.log('   ✅ Réponse différée');

        await interaction.editReply({
          content: '🔄 Synchronisation de l\'historique en cours... Cela peut prendre plusieurs minutes.',
        });
        console.log('   ✅ Message initial envoyé');

        console.log('   🔄 Démarrage de syncHistory...');
        const stats = await syncHistory(client, client.supabase, {
          limit: 100, // 100 messages par canal
          maxChannels: 50, // Maximum 50 canaux par serveur
          delayBetweenChannels: 1000, // 1 seconde entre chaque canal
        });
        console.log('   ✅ syncHistory terminée:', stats);

        const embed = new EmbedBuilder()
          .setTitle('✅ Synchronisation terminée')
          .setColor(0x57F287)
          .addFields(
            { name: '📊 Serveurs traités', value: stats.guilds.toString(), inline: true },
            { name: '📝 Canaux traités', value: stats.channels.toString(), inline: true },
            { name: '💬 Messages insérés', value: stats.messages.toString(), inline: true },
            { name: '❌ Erreurs', value: stats.errors.toString(), inline: true }
          )
          .setTimestamp()
          .setFooter({ text: 'Community Intelligence Bot' });

        await interaction.editReply({
          content: null,
          embeds: [embed],
        });
        console.log('   ✅ Message final envoyé avec les statistiques');
      } catch (error) {
        console.error('❌ Erreur lors de la synchronisation:', error);
        console.error('   Stack:', error.stack);
        try {
          await interaction.editReply({
            content: `❌ Erreur lors de la synchronisation: ${error.message}`,
          });
        } catch (replyError) {
          console.error('❌ Impossible d\'envoyer le message d\'erreur:', replyError);
        }
      }
    },
  },
  {
    name: 'ci-xp',
    description: 'Affiche votre niveau XP et le leaderboard du serveur',
    execute: async (interaction, client) => {
      await interaction.deferReply();

      try {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        // Récupérer le profil XP de l'utilisateur
        const profile = await getOrCreateXPProfile(userId, guildId, client.supabase);
        
        if (!profile) {
          return interaction.editReply({
            content: '❌ Erreur lors de la récupération de votre profil XP.',
          });
        }

        // Récupérer le leaderboard
        const leaderboard = await getLeaderboard(guildId, client.supabase, 10);
        const userRank = await getUserRank(userId, guildId, client.supabase);

        // Calculer la progression vers le prochain niveau
        const xpForNext = xpForNextLevel(profile.xp);
        const currentLevel = calculateLevel(profile.xp);
        const progressBarLength = 20;
        const xpInCurrentLevel = profile.xp - (Math.pow(currentLevel - 1, 2) * 100);
        const xpNeededForCurrentLevel = (Math.pow(currentLevel, 2) * 100) - (Math.pow(currentLevel - 1, 2) * 100);
        const progressPercent = Math.min(100, (xpInCurrentLevel / xpNeededForCurrentLevel) * 100);
        const filledBars = Math.floor((progressPercent / 100) * progressBarLength);
        const progressBar = '█'.repeat(filledBars) + '░'.repeat(progressBarLength - filledBars);

        // Formater le leaderboard
        let leaderboardText = '';
        if (leaderboard.length > 0) {
          leaderboardText = leaderboard
            .slice(0, 10)
            .map((entry, index) => {
              const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
              const userMention = entry.user_id === userId ? `**<@${entry.user_id}>**` : `<@${entry.user_id}>`;
              return `${medal} ${userMention} - Niveau ${entry.level} (${entry.xp} XP)`;
            })
            .join('\n');
        } else {
          leaderboardText = 'Aucun membre dans le leaderboard pour le moment.';
        }

        const embed = new EmbedBuilder()
          .setTitle('🏆 Système de Gamification')
          .setColor(0xFFD700)
          .setDescription(`**Votre profil XP**`)
          .addFields(
            {
              name: '📊 Votre niveau',
              value: `**Niveau ${currentLevel}**\n${progressBar} ${Math.round(progressPercent)}%\n${xpInCurrentLevel}/${xpNeededForCurrentLevel} XP`,
              inline: false,
            },
            {
              name: '💎 Statistiques',
              value: `**XP Total:** ${profile.xp} XP\n**Messages:** ${profile.total_messages || 0}\n**Questions répondues:** ${profile.questions_answered || 0}\n**Rang:** #${userRank || 'N/A'}`,
              inline: false,
            },
            {
              name: '🎯 Prochain niveau',
              value: `${xpForNext} XP restants pour atteindre le niveau ${currentLevel + 1}`,
              inline: false,
            },
            {
              name: '🏅 Leaderboard (Top 10)',
              value: leaderboardText.length > 1024 ? leaderboardText.substring(0, 1020) + '...' : leaderboardText,
              inline: false,
            }
          )
          .setTimestamp()
          .setFooter({ text: 'Community Intelligence Bot - Gamification' });

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error('Erreur dans /ci-xp:', error);
        await interaction.editReply({
          content: `❌ Erreur lors de la récupération des données XP: ${error.message}`,
        });
      }
    },
  },
  {
    name: 'ci-bot-detection',
    description: 'Affiche les statistiques de détection de bots et spam',
    execute: async (interaction, client) => {
      await interaction.deferReply();

      try {
        const guildId = interaction.guild.id;
        const channelId = interaction.channel.id;

        // Récupérer les stats générales
        const botStats = await getBotDetectionStats(guildId, client.supabase);
        
        // Analyser le canal actuel
        const channelSpam = await analyzeChannelSpam(guildId, channelId, client.supabase, 24);
        
        // Détecter les spikes d'activité
        const activitySpike = await detectActivitySpike(guildId, client.supabase, 1);

        // Formater les utilisateurs suspects du canal
        let suspiciousUsersText = 'Aucun utilisateur suspect détecté';
        if (channelSpam.suspiciousUsers.length > 0) {
          suspiciousUsersText = channelSpam.suspiciousUsers
            .slice(0, 5)
            .map((user, index) => {
              return `${index + 1}. <@${user.author_id}> - ${user.message_count} messages (${user.repetition_rate}% répétition)`;
            })
            .join('\n');
        }

        const embed = new EmbedBuilder()
          .setTitle('🤖 Détection de Bots et Spam')
          .setColor(0xFF6B6B)
          .addFields(
            {
              name: '📊 Statistiques Générales',
              value: `**Utilisateurs totaux:** ${botStats.totalUsers}\n**Utilisateurs suspects:** ${botStats.suspiciousUsers}\n**Taux de spam:** ${botStats.spamRate}%\n**Comptes récents:** ${botStats.recentAccounts}`,
              inline: false,
            },
            {
              name: '📝 Canal Actuel',
              value: `**Messages (24h):** ${channelSpam.totalMessages}\n**Taux de spam:** ${channelSpam.spamRate}%\n**Utilisateurs suspects:** ${channelSpam.suspiciousUsers.length}`,
              inline: false,
            },
            {
              name: '⚠️ Utilisateurs Suspects (Top 5)',
              value: suspiciousUsersText.length > 1024 ? suspiciousUsersText.substring(0, 1020) + '...' : suspiciousUsersText,
              inline: false,
            }
          )
          .setTimestamp()
          .setFooter({ text: 'Community Intelligence Bot - Bot Detection' });

        // Ajouter une alerte si spike détecté
        if (activitySpike.isSpike) {
          embed.addFields({
            name: '🚨 Alerte: Spike d\'Activité',
            value: `**Augmentation:** +${activitySpike.increase}%\n**Messages (1h):** ${activitySpike.currentMessages} (vs ${activitySpike.previousMessages} précédemment)\n⚠️ Possible spam ou raid`,
            inline: false,
          });
          embed.setColor(0xFF0000); // Rouge pour alerte
        }

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error('Erreur dans /ci-bot-detection:', error);
        await interaction.editReply({
          content: `❌ Erreur lors de la détection de bots: ${error.message}`,
        });
      }
    },
  },
  {
    name: 'ci-counter',
    description: 'Gère les compteurs visuels dans les canaux',
    options: [
      {
        name: 'action',
        type: 3, // STRING
        description: 'Action à effectuer',
        required: true,
        choices: [
          { name: 'Créer un compteur', value: 'create' },
          { name: 'Supprimer un compteur', value: 'delete' },
          { name: 'Liste des compteurs', value: 'list' },
        ],
      },
      {
        name: 'type',
        type: 3, // STRING
        description: 'Type de compteur (si création)',
        required: false,
        choices: [
          { name: '📊 Membres totaux', value: 'members' },
          { name: '💬 Messages totaux', value: 'messages' },
          { name: '👥 Membres en ligne', value: 'online' },
          { name: '💬 Messages aujourd\'hui', value: 'messages_today' },
        ],
      },
      {
        name: 'canal',
        type: 7, // CHANNEL
        description: 'Canal pour le compteur (si création/suppression)',
        required: false,
      },
    ],
    execute: async (interaction, client) => {
      await interaction.deferReply({ ephemeral: true });

      // Vérifier le plan premium
      const hasCountersFeature = await hasFeature(interaction.guild.id, 'channelCounters', client.supabase);

      if (!hasCountersFeature) {
        return interaction.editReply({
          content: `❌ Les channel counters nécessitent un plan premium.\n\n💎 **Passez à Pro** pour débloquer cette fonctionnalité : \`/ci-upgrade\``,
        });
      }

      try {
        const action = interaction.options.getString('action');
        const guildId = interaction.guild.id;

        if (action === 'list') {
          const counters = await getGuildCounters(guildId, client.supabase);
          
          if (counters.length === 0) {
            return interaction.editReply({
              content: '📊 Aucun compteur configuré pour ce serveur.\n\nUtilisez `/ci-counter create` pour en créer un.',
            });
          }

          const countersList = counters.map(c => {
            const channel = interaction.guild.channels.cache.get(c.channel_id);
            const channelName = channel ? `#${channel.name}` : `Canal ${c.channel_id}`;
            const typeNames = {
              members: '📊 Membres',
              messages: '💬 Messages',
              online: '👥 En ligne',
              messages_today: '💬 Aujourd\'hui',
            };
            return `- ${channelName}: ${typeNames[c.counter_type] || c.counter_type}`;
          }).join('\n');

          const embed = new EmbedBuilder()
            .setTitle('📊 Compteurs Configurés')
            .setColor(0x5865F2)
            .setDescription(countersList)
            .setFooter({ text: 'Community Intelligence Bot' });

          return interaction.editReply({ embeds: [embed] });
        }

        const channel = interaction.options.getChannel('canal') || interaction.channel;
        const counterType = interaction.options.getString('type');

        if (action === 'create') {
          if (!counterType) {
            return interaction.editReply({
              content: '❌ Veuillez spécifier un type de compteur avec l\'option `type`.',
            });
          }

          if (!channel.isTextBased() || channel.isDMBased()) {
            return interaction.editReply({
              content: '❌ Le canal doit être un canal texte valide.',
            });
          }

          await createChannelCounter(guildId, channel.id, counterType, client.supabase);
          
          // Mettre à jour immédiatement
          await updateAllChannelCounters(interaction.guild, client.supabase);

          return interaction.editReply({
            content: `✅ Compteur créé dans ${channel} ! Le nom du canal sera mis à jour automatiquement.`,
          });
        }

        if (action === 'delete') {
          await deleteChannelCounter(guildId, channel.id, client.supabase);
          return interaction.editReply({
            content: `✅ Compteur supprimé de ${channel}.`,
          });
        }
      } catch (error) {
        console.error('Erreur dans /ci-counter:', error);
        await interaction.editReply({
          content: `❌ Erreur: ${error.message}`,
        });
      }
    },
  },
  {
    name: 'ci-sentiment',
    description: 'Analyse le sentiment des messages (positif/neutre/négatif)',
    options: [
      {
        name: 'canal',
        type: 7, // CHANNEL
        description: 'Canal à analyser (optionnel, analyse tout le serveur par défaut)',
        required: false,
      },
      {
        name: 'période',
        type: 3, // STRING
        description: 'Période d\'analyse',
        required: false,
        choices: [
          { name: 'Dernières 24 heures', value: '24' },
          { name: 'Dernières 7 jours', value: '168' },
          { name: 'Dernières 30 jours', value: '720' },
        ],
      },
    ],
    execute: async (interaction, client) => {
      await interaction.deferReply();

      // Vérifier le plan premium
      const plan = await getGuildPlan(interaction.guild.id, client.supabase);
      const hasSentimentFeature = await hasFeature(interaction.guild.id, 'sentimentAnalysis', client.supabase);

      if (!hasSentimentFeature) {
        return interaction.editReply({
          content: `❌ L'analyse de sentiment nécessite un plan premium.\n\n💎 **Passez à Pro** pour débloquer cette fonctionnalité : \`/ci-upgrade\``,
        });
      }

      try {
        const guildId = interaction.guild.id;
        const channel = interaction.options.getChannel('canal');
        const periodHours = parseInt(interaction.options.getString('période') || '24');

        let sentimentData;
        let title;

        if (channel) {
          title = `📊 Sentiment du canal ${channel.name}`;
          sentimentData = await analyzeChannelSentiment(guildId, channel.id, client.supabase, periodHours);
        } else {
          title = '📊 Sentiment du serveur';
          sentimentData = await analyzeGuildSentiment(guildId, client.supabase, periodHours);
        }

        if (sentimentData.total === 0) {
          return interaction.editReply({
            content: '❌ Aucun message à analyser pour cette période.',
          });
        }

        // Créer une barre de progression visuelle
        const barLength = 20;
        const positifBars = Math.round((sentimentData.positifPercent / 100) * barLength);
        const neutreBars = Math.round((sentimentData.neutrePercent / 100) * barLength);
        const négatifBars = barLength - positifBars - neutreBars;

        const progressBar = 
          '🟢'.repeat(positifBars) + 
          '🟡'.repeat(neutreBars) + 
          '🔴'.repeat(négatifBars);

        const sentimentEmoji = {
          positif: '😊',
          neutre: '😐',
          négatif: '😠',
        };

        const embed = new EmbedBuilder()
          .setTitle(title)
          .setColor(
            sentimentData.sentiment === 'positif' ? 0x57F287 :
            sentimentData.sentiment === 'négatif' ? 0xED4245 :
            0xFEE75C
          )
          .setDescription(`${sentimentEmoji[sentimentData.sentiment]} **Sentiment dominant: ${sentimentData.sentiment.toUpperCase()}**`)
          .addFields(
            {
              name: '📊 Répartition',
              value: `**Positif:** ${sentimentData.positif} (${sentimentData.positifPercent}%)\n**Neutre:** ${sentimentData.neutre} (${sentimentData.neutrePercent}%)\n**Négatif:** ${sentimentData.négatif} (${sentimentData.négatifPercent}%)`,
              inline: false,
            },
            {
              name: '📈 Visualisation',
              value: progressBar,
              inline: false,
            },
            {
              name: '📝 Détails',
              value: `**Messages analysés:** ${sentimentData.total}\n**Période:** ${periodHours}h`,
              inline: false,
            }
          )
          .setTimestamp()
          .setFooter({ text: 'Community Intelligence Bot - Sentiment Analysis' });

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error('Erreur dans /ci-sentiment:', error);
        await interaction.editReply({
          content: `❌ Erreur lors de l'analyse de sentiment: ${error.message}\n\n💡 Assurez-vous que GROQ_API_KEY est configurée.`,
        });
      }
    },
  },
  {
    name: 'ci-predictions',
    description: '🔮 Prédictions et alertes proactives pour les 7 prochains jours',
    execute: async (interaction, client) => {
      await interaction.deferReply();

      // Vérifier le plan premium
      const plan = await getGuildPlan(interaction.guild.id, client.supabase);
      const hasPredictionsFeature = await hasFeature(interaction.guild.id, 'predictions', client.supabase);

      if (!hasPredictionsFeature) {
        return interaction.editReply({
          content: `❌ Les prédictions nécessitent un plan premium.\n\n💎 **Passez à Pro** pour débloquer cette fonctionnalité : \`/ci-upgrade\``,
        });
      }

      try {
        const guildId = interaction.guild.id;
        const predictions = await generatePredictions(guildId, client.supabase);

        // Formater les VIP inactifs
        let inactiveVIPsText = 'Aucun membre très actif inactif détecté';
        if (predictions.inactive_vips.length > 0) {
          inactiveVIPsText = predictions.inactive_vips
            .slice(0, 5)
            .map((vip, index) => {
              return `${index + 1}. <@${vip.user_id}> - Inactif depuis ${vip.days_inactive} jours (${vip.xp} XP)`;
            })
            .join('\n');
        }

        // Formater les questions non répondues
        let unansweredText = 'Aucune question ancienne non répondue';
        if (predictions.unanswered_questions.length > 0) {
          unansweredText = `${predictions.unanswered_questions.length} questions non répondues depuis 3+ jours`;
          if (predictions.unanswered_questions.length <= 5) {
            unansweredText = predictions.unanswered_questions
              .map((q, i) => `${i + 1}. <#${q.channel_id}> - ${q.content.substring(0, 60)}...`)
              .join('\n');
          }
        }

        // Formater les tendances de canaux
        let channelTrendsText = 'Aucun canal en baisse significative';
        if (predictions.channel_trends.length > 0) {
          channelTrendsText = predictions.channel_trends
            .map((trend, index) => {
              return `${index + 1}. <#${trend.channel_id}> : Baisse de ${Math.abs(trend.change)}% (${trend.recent_count} vs ${trend.previous_count} messages)`;
            })
            .join('\n');
        }

        // Formater les recommandations
        const recommendationsText = predictions.recommendations
          .map((rec, index) => `${rec.emoji} ${index + 1}. ${rec.text}`)
          .join('\n') || 'Aucune recommandation spécifique';

        const trendEmoji = predictions.engagement_trend > 0 ? '📈' : predictions.engagement_trend < 0 ? '📉' : '➡️';
        const trendColor = predictions.engagement_trend > 0 ? 0x57F287 : predictions.engagement_trend < 0 ? 0xED4245 : 0xFEE75C;

        const embed = new EmbedBuilder()
          .setTitle('🔮 PRÉDICTIONS (7 prochains jours)')
          .setColor(trendColor)
          .setDescription(`Analyse basée sur les tendances des 2 dernières semaines`)
          .addFields(
            {
              name: `${trendEmoji} TENDANCES D\'ENGAGEMENT`,
              value: `**Engagement:** ${predictions.engagement_trend > 0 ? '+' : ''}${predictions.engagement_trend}% (${predictions.engagement_trend > 0 ? 'hausse' : predictions.engagement_trend < 0 ? 'baisse' : 'stable'})\n**Messages quotidiens prévus:** ${predictions.predicted_daily_messages} (vs ${predictions.current_week.dailyMessages} actuellement)\n**Nouveaux membres prévus:** +${predictions.predicted_new_members}`,
              inline: false,
            },
            {
              name: '⚠️ ALERTES CRITIQUES',
              value: channelTrendsText.length > 1024 ? channelTrendsText.substring(0, 1020) + '...' : channelTrendsText,
              inline: false,
            },
            {
              name: '❓ QUESTIONS NON RÉPONDUES',
              value: unansweredText.length > 1024 ? unansweredText.substring(0, 1020) + '...' : unansweredText,
              inline: false,
            },
            {
              name: '👥 MEMBRES VIP INACTIFS',
              value: inactiveVIPsText.length > 1024 ? inactiveVIPsText.substring(0, 1020) + '...' : inactiveVIPsText,
              inline: false,
            },
            {
              name: '💡 RECOMMANDATIONS',
              value: recommendationsText.length > 1024 ? recommendationsText.substring(0, 1020) + '...' : recommendationsText,
              inline: false,
            }
          )
          .setTimestamp()
          .setFooter({ text: 'Community Intelligence Bot - Prédictions Proactives' });

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error('Erreur dans /ci-predictions:', error);
        await interaction.editReply({
          content: `❌ Erreur lors de la génération des prédictions: ${error.message}`,
        });
      }
    },
  },
  {
    name: 'ci-quest',
    description: '🎯 Gère les quêtes personnalisées quotidiennes',
    options: [
      {
        name: 'action',
        type: 3, // STRING
        description: 'Action à effectuer',
        required: true,
        choices: [
          { name: 'Générer ma quête du jour', value: 'generate' },
          { name: 'Voir mes quêtes actives', value: 'list' },
        ],
      },
    ],
    execute: async (interaction, client) => {
      await interaction.deferReply({ ephemeral: true });

      // Vérifier le plan premium
      const hasQuestsFeature = await hasFeature(interaction.guild.id, 'quests', client.supabase);

      if (!hasQuestsFeature) {
        return interaction.editReply({
          content: `❌ Les quêtes personnalisées nécessitent un plan premium.\n\n💎 **Passez à Pro** pour débloquer cette fonctionnalité : \`/ci-upgrade\``,
        });
      }

      try {
        const action = interaction.options.getString('action');
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        if (action === 'generate') {
          const quest = await generatePersonalQuest(userId, guildId, client.supabase, interaction.guild);

          const questsText = quest.quests.map((q, i) => `${i + 1}. ${q}`).join('\n');

          const embed = new EmbedBuilder()
            .setTitle('🎯 QUÊTE DU JOUR')
            .setColor(0xFFD700)
            .setDescription(`Quêtes personnalisées pour <@${userId}>`)
            .addFields(
              {
                name: '📋 Objectifs',
                value: questsText,
                inline: false,
              },
              {
                name: '🎁 Récompenses',
                value: `+${quest.rewards.xp} XP${quest.rewards.role ? `\nRôle: ${quest.rewards.role}` : ''}`,
                inline: false,
              },
              {
                name: '⏰ Expiration',
                value: `<t:${Math.floor(quest.expiresAt.getTime() / 1000)}:R>`,
                inline: false,
              }
            )
            .setFooter({ text: 'Community Intelligence Bot - Quêtes' });

          return interaction.editReply({ embeds: [embed] });
        }

        if (action === 'list') {
          return interaction.editReply({
            content: '📋 Fonctionnalité en développement. Utilisez `/ci-quest generate` pour générer une nouvelle quête.',
          });
        }
      } catch (error) {
        console.error('Erreur dans /ci-quest:', error);
        await interaction.editReply({
          content: `❌ Erreur: ${error.message}`,
        });
      }
    },
  },
  {
    name: 'ci-mod-report',
    description: '📊 Rapport de performance d\'un modérateur',
    options: [
      {
        name: 'modérateur',
        type: 6, // USER
        description: 'Modérateur à analyser (optionnel, vous-même par défaut)',
        required: false,
      },
      {
        name: 'période',
        type: 3, // STRING
        description: 'Période d\'analyse',
        required: false,
        choices: [
          { name: '7 derniers jours', value: '7' },
          { name: '30 derniers jours', value: '30' },
        ],
      },
    ],
    execute: async (interaction, client) => {
      await interaction.deferReply();

      // Vérifier le plan premium (Business+)
      const hasModPerformanceFeature = await hasFeature(interaction.guild.id, 'modPerformance', client.supabase);

      if (!hasModPerformanceFeature) {
        return interaction.editReply({
          content: `❌ Le suivi de performance des modérateurs nécessite un plan Business ou Enterprise.\n\n🚀 **Passez à Business** pour débloquer cette fonctionnalité : \`/ci-upgrade\``,
        });
      }

      try {
        const modUser = interaction.options.getUser('modérateur') || interaction.user;
        const periodDays = parseInt(interaction.options.getString('période') || '7');
        const guildId = interaction.guild.id;

        const periodStart = new Date();
        periodStart.setDate(periodStart.getDate() - periodDays);

        // Récupérer les messages du mod
        const { data: modMessages } = await client.supabase
          .from('messages')
          .select('*')
          .eq('guild_id', guildId)
          .eq('author_id', modUser.id)
          .gte('created_at', periodStart.toISOString());

        const totalMessages = modMessages?.length || 0;
        const replies = modMessages?.filter(m => m.is_reply).length || 0;
        const questionsAnswered = modMessages?.filter(m => m.is_reply && m.reaction_count > 0).length || 0;

        // Calculer le temps de réponse moyen (approximation basée sur les réponses)
        // Dans une implémentation complète, on trackerait les timestamps des questions/réponses

        const embed = new EmbedBuilder()
          .setTitle(`📊 RAPPORT MODÉRATION - ${modUser.displayName}`)
          .setColor(0x5865F2)
          .setDescription(`Période : ${periodDays} derniers jours`)
          .addFields(
            {
              name: '⚡ RÉACTIVITÉ',
              value: `**Messages envoyés:** ${totalMessages}\n**Réponses:** ${replies}\n**Questions répondues:** ${questionsAnswered}\n**Taux de réponse:** ${totalMessages > 0 ? Math.round((replies / totalMessages) * 100) : 0}%`,
              inline: false,
            },
            {
              name: '💬 ENGAGEMENT',
              value: `**Messages/jour:** ${Math.round(totalMessages / periodDays)}\n**Réactions reçues:** ${modMessages?.reduce((sum, m) => sum + (m.reaction_count || 0), 0) || 0}\n**Messages avec réactions:** ${modMessages?.filter(m => m.reaction_count > 0).length || 0}`,
              inline: false,
            }
          )
          .setThumbnail(modUser.displayAvatarURL())
          .setTimestamp()
          .setFooter({ text: 'Community Intelligence Bot - Mod Performance' });

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error('Erreur dans /ci-mod-report:', error);
        await interaction.editReply({
          content: `❌ Erreur: ${error.message}`,
        });
      }
    },
  },
  {
    name: 'ci-voice-stats',
    description: '🎤 Statistiques de l\'activité vocale du serveur',
    options: [
      {
        name: 'période',
        type: 3, // STRING
        description: 'Période d\'analyse',
        required: false,
        choices: [
          { name: '7 derniers jours', value: '168' },
          { name: '30 derniers jours', value: '720' },
        ],
      },
    ],
    execute: async (interaction, client) => {
      await interaction.deferReply();

      // Vérifier le plan premium
      const hasVoiceFeature = await hasFeature(interaction.guild.id, 'voiceAnalytics', client.supabase);

      if (!hasVoiceFeature) {
        return interaction.editReply({
          content: `❌ Les statistiques vocales nécessitent un plan premium.\n\n💎 **Passez à Pro** pour débloquer cette fonctionnalité : \`/ci-upgrade\``,
        });
      }

      try {
        const guildId = interaction.guild.id;
        const periodHours = parseInt(interaction.options.getString('période') || '168');
        const stats = await getVoiceStats(guildId, client.supabase, periodHours);

        if (stats.message) {
          return interaction.editReply({
            content: `📊 ${stats.message}\n\n💡 Les statistiques vocales seront disponibles une fois que des membres auront utilisé les canaux vocaux.`,
          });
        }

        // Formater les top membres
        let topMembersText = 'Aucun membre vocal actif';
        if (stats.topMembers.length > 0) {
          topMembersText = stats.topMembers
            .slice(0, 10)
            .map((member, index) => {
              const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
              return `${medal} <@${member.user_id}> - ${member.hours}h (${member.sessions} sessions)`;
            })
            .join('\n');
        }

        // Formater les top canaux
        let topChannelsText = 'Aucun canal vocal actif';
        if (stats.topChannels.length > 0) {
          topChannelsText = stats.topChannels
            .map((channel, index) => {
              return `${index + 1}. <#${channel.channel_id}> - ${channel.hours}h`;
            })
            .join('\n');
        }

        // Formater les heures de pic
        let peakHoursText = 'Données insuffisantes';
        if (stats.peakHours.length > 0) {
          peakHoursText = stats.peakHours
            .map((peak, index) => {
              return `${index + 1}. ${peak.hour}h00 - ${peak.sessions} sessions`;
            })
            .join('\n');
        }

        const embed = new EmbedBuilder()
          .setTitle('🎤 STATISTIQUES VOCALES')
          .setColor(0x5865F2)
          .setDescription(`Période : ${periodHours / 24} derniers jours`)
          .addFields(
            {
              name: '📊 Vue d\'ensemble',
              value: `**Temps total:** ${stats.totalHours}h\n**Membres actifs:** ${stats.activeMembers}\n**Sessions totales:** ${stats.totalSessions}`,
              inline: false,
            },
            {
              name: '🏆 TOP VOCAL',
              value: topMembersText.length > 1024 ? topMembersText.substring(0, 1020) + '...' : topMembersText,
              inline: false,
            },
            {
              name: '📊 CANAUX POPULAIRES',
              value: topChannelsText.length > 1024 ? topChannelsText.substring(0, 1020) + '...' : topChannelsText,
              inline: false,
            },
            {
              name: '⏰ HEURES DE PIC',
              value: peakHoursText,
              inline: false,
            }
          )
          .setTimestamp()
          .setFooter({ text: 'Community Intelligence Bot - Voice Analytics' });

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error('Erreur dans /ci-voice-stats:', error);
        await interaction.editReply({
          content: `❌ Erreur: ${error.message}`,
        });
      }
    },
  },
  {
    name: 'ci-trust-score',
    description: '🛡️ Affiche le score de confiance d\'un membre',
    options: [
      {
        name: 'membre',
        type: 6, // USER
        description: 'Membre à analyser (optionnel, vous-même par défaut)',
        required: false,
      },
    ],
    execute: async (interaction, client) => {
      await interaction.deferReply();

      try {
        const targetUser = interaction.options.getUser('membre') || interaction.user;
        const guildId = interaction.guild.id;

        const trustScore = await calculateTrustScore(targetUser.id, guildId, client.supabase, interaction.guild);

        const scoreColor = trustScore.score >= 70 ? 0x57F287 : trustScore.score >= 40 ? 0xFEE75C : 0xED4245;
        const scoreEmoji = trustScore.score >= 70 ? '✅' : trustScore.score >= 40 ? '⚠️' : '❌';
        const scoreLabel = trustScore.score >= 70 ? 'Membre légitime' : trustScore.score >= 40 ? 'Suspect' : 'Très suspect';

        const reasonsText = trustScore.reasons.length > 0
          ? trustScore.reasons.map(r => `${r.positive ? '✅' : '⚠️'} ${r.reason}`).join('\n')
          : 'Aucun indicateur spécifique';

        const embed = new EmbedBuilder()
          .setTitle(`🛡️ SCORE DE CONFIANCE - ${targetUser.displayName}`)
          .setColor(scoreColor)
          .setDescription(`${scoreEmoji} **Score: ${trustScore.score}/100** - ${scoreLabel}`)
          .addFields(
            {
              name: '📊 Détails',
              value: reasonsText.length > 1024 ? reasonsText.substring(0, 1020) + '...' : reasonsText,
              inline: false,
            }
          )
          .setThumbnail(targetUser.displayAvatarURL())
          .setTimestamp()
          .setFooter({ text: 'Community Intelligence Bot - Trust Score' });

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error('Erreur dans /ci-trust-score:', error);
        await interaction.editReply({
          content: `❌ Erreur: ${error.message}`,
        });
      }
    },
  },
  {
    name: 'ci-badges',
    description: '🏆 Affiche tes badges et achievements',
    options: [
      {
        name: 'membre',
        type: 6, // USER
        description: 'Membre à voir (optionnel, vous-même par défaut)',
        required: false,
      },
    ],
    execute: async (interaction, client) => {
      await interaction.deferReply({ ephemeral: true });

      try {
        const targetUser = interaction.options.getUser('membre') || interaction.user;
        const guildId = interaction.guild.id;

        const badges = await getUserBadges(targetUser.id, guildId, client.supabase, interaction.guild);

        if (badges.length === 0) {
          return interaction.editReply({
            content: `🏆 ${targetUser.displayName} n'a pas encore de badges.\n\n💡 Envoie des messages, réponds aux questions et sois actif pour débloquer des badges !`,
          });
        }

        const badgesText = badges.map(b => `${b.emoji} **${b.name}** - ${b.description}`).join('\n');

        const embed = new EmbedBuilder()
          .setTitle(`🏆 BADGES - ${targetUser.displayName}`)
          .setColor(0xFFD700)
          .setDescription(badgesText)
          .setThumbnail(targetUser.displayAvatarURL())
          .setFooter({ text: `Total: ${badges.length} badges` });

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error('Erreur dans /ci-badges:', error);
        await interaction.editReply({
          content: `❌ Erreur: ${error.message}`,
        });
      }
    },
  },
  {
    name: 'ci-upgrade',
    description: '💳 Passez à un plan premium',
    options: [
      {
        name: 'plan',
        type: 3, // STRING
        description: 'Plan à souscrire',
        required: true,
        choices: [
          { name: '💎 Pro - 25€/mois', value: 'pro' },
          { name: '🚀 Business - 75€/mois', value: 'business' },
          { name: '🏢 Enterprise - 250€/mois', value: 'enterprise' },
        ],
      },
    ],
    execute: async (interaction, client) => {
      await interaction.deferReply({ ephemeral: true });

      try {
        const planType = interaction.options.getString('plan');
        const guildId = interaction.guild.id;
        const userId = interaction.user.id;

        // Vérifier le plan actuel
        const currentPlan = await getGuildPlan(guildId, client.supabase);
        if (currentPlan && currentPlan.plan_type === planType && currentPlan.status === 'active') {
          return interaction.editReply({
            content: `✅ Vous avez déjà le plan **${planType.toUpperCase()}** actif !`,
          });
        }

        // Créer la session de checkout
        const { url } = await createCheckoutSession(guildId, planType, userId, client.supabase);

        const planNames = {
          pro: '💎 Pro',
          business: '🚀 Business',
          enterprise: '🏢 Enterprise',
        };

        const planPrices = {
          pro: '25€',
          business: '75€',
          enterprise: '250€',
        };

        const embed = new EmbedBuilder()
          .setTitle('💳 Passer à un plan premium')
          .setColor(0x5865F2)
          .setDescription(`Cliquez sur le lien ci-dessous pour souscrire au plan **${planNames[planType]}** (${planPrices[planType]}/mois)`)
          .addFields(
            {
              name: '📋 Plan sélectionné',
              value: `${planNames[planType]} - ${planPrices[planType]}/mois`,
              inline: false,
            },
            {
              name: '🔗 Lien de paiement',
              value: `[Cliquez ici pour payer](${url})`,
              inline: false,
            }
          )
          .setFooter({ text: 'Paiement sécurisé par Stripe' });

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error('Erreur dans /ci-upgrade:', error);
        await interaction.editReply({
          content: `❌ Erreur lors de la création du lien de paiement: ${error.message}\n\n💡 Assurez-vous que STRIPE_SECRET_KEY est configurée.`,
        });
      }
    },
  },
  {
    name: 'ci-billing',
    description: '💳 Gérer votre abonnement et factures',
    execute: async (interaction, client) => {
      await interaction.deferReply({ ephemeral: true });

      try {
        const guildId = interaction.guild.id;
        const userId = interaction.user.id;

        // Vérifier le plan actuel
        const currentPlan = await getGuildPlan(guildId, client.supabase);

        if (!currentPlan || currentPlan.plan_type === 'free' || !currentPlan.stripe_customer_id) {
          return interaction.editReply({
            content: '❌ Aucun abonnement actif trouvé pour ce serveur.\n\n💡 Utilisez `/ci-upgrade` pour souscrire à un plan premium.',
          });
        }

        // Créer le portail de facturation
        const { url } = await createBillingPortal(guildId, userId, client.supabase);

        const embed = new EmbedBuilder()
          .setTitle('💳 Gestion de l\'abonnement')
          .setColor(0x5865F2)
          .setDescription(`Plan actuel: **${currentPlan.plan_type.toUpperCase()}**\nStatus: **${currentPlan.status}**`)
          .addFields(
            {
              name: '🔗 Portail de facturation',
              value: `[Cliquez ici pour gérer votre abonnement](${url})\n\nVous pourrez :\n- Voir vos factures\n- Modifier votre plan\n- Annuler votre abonnement\n- Mettre à jour votre méthode de paiement`,
              inline: false,
            }
          )
          .setFooter({ text: 'Gestion sécurisée par Stripe' });

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error('Erreur dans /ci-billing:', error);
        await interaction.editReply({
          content: `❌ Erreur: ${error.message}`,
        });
      }
    },
  },
  {
    name: 'ci-plan',
    description: '📊 Affiche votre plan actuel et les fonctionnalités disponibles',
    execute: async (interaction, client) => {
      await interaction.deferReply({ ephemeral: true });

      try {
        const guildId = interaction.guild.id;
        const plan = await getGuildPlan(guildId, client.supabase);

        if (!plan) {
          return interaction.editReply({
            content: '❌ Erreur lors de la récupération du plan.',
          });
        }

        const planNames = {
          free: '🆓 Gratuit',
          pro: '💎 Pro',
          business: '🚀 Business',
          enterprise: '🏢 Enterprise',
        };

        const planFeatures = {
          free: [
            '1 serveur',
            '10,000 messages/mois',
            'Stats basiques',
            'Gamification limitée',
          ],
          pro: [
            '5 serveurs',
            'Messages illimités',
            'Sentiment analysis',
            'Prédictions & alertes',
            'Channel counters',
            'Voice analytics',
            'Quêtes personnalisées',
            'Export CSV',
          ],
          business: [
            'Serveurs illimités',
            'Tout Pro +',
            'Mod performance tracking',
            'Benchmarking',
            'Webhooks',
            'API REST',
            'Discord SEO',
            'Support prioritaire',
          ],
          enterprise: [
            'Tout Business +',
            'AI chatbot custom',
            'White-label',
            'Onboarding dédié',
            'SLA 99.9%',
            'Success manager',
          ],
        };

        const embed = new EmbedBuilder()
          .setTitle('📊 Votre Plan')
          .setColor(plan.plan_type === 'free' ? 0x95A5A6 : 0x5865F2)
          .setDescription(`Plan actuel: **${planNames[plan.plan_type]}**\nStatus: **${plan.status}**`)
          .addFields(
            {
              name: '✨ Fonctionnalités incluses',
              value: planFeatures[plan.plan_type].map(f => `✅ ${f}`).join('\n'),
              inline: false,
            }
          )
          .setFooter({ text: 'Community Intelligence Bot' });

        if (plan.current_period_end) {
          const endDate = new Date(plan.current_period_end);
          embed.addFields({
            name: '📅 Prochain renouvellement',
            value: `<t:${Math.floor(endDate.getTime() / 1000)}:R>`,
            inline: false,
          });
        }

        if (plan.plan_type === 'free') {
          embed.addFields({
            name: '💳 Passer à un plan premium',
            value: 'Utilisez `/ci-upgrade` pour découvrir nos plans premium !',
            inline: false,
          });
        }

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error('Erreur dans /ci-plan:', error);
        await interaction.editReply({
          content: `❌ Erreur: ${error.message}`,
        });
      }
    },
  },
];

