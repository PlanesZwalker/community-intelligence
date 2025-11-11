import { EmbedBuilder } from 'discord.js';
import { getStats } from '../utils/analytics.js';
import { getWeeklySummary } from '../utils/weeklySummary.js';
import { generateEngagementRecommendations } from '../utils/aiService.js';
import { syncHistory } from '../utils/syncHistory.js';

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
];

