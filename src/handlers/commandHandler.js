import { EmbedBuilder } from 'discord.js';
import { getStats } from '../utils/analytics.js';
import { getWeeklySummary } from '../utils/weeklySummary.js';
import { generateEngagementRecommendations } from '../utils/aiService.js';

/**
 * Gère les commandes slash
 */
export async function commandHandler(interaction, client) {
  // Vérifier que c'est bien une interaction valide
  if (!interaction || typeof interaction.commandName !== 'string') {
    console.error('❌ Interaction invalide reçue:', interaction);
    return;
  }

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.warn(`⚠️ Commande non trouvée: ${interaction.commandName}`);
    if (interaction.isRepliable()) {
      return interaction.reply({
        content: '❌ Commande non trouvée',
        ephemeral: true,
      }).catch(err => console.error('Erreur lors de la réponse:', err));
    }
    return;
  }

  try {
    await command.execute(interaction, client);
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
    name: 'stats',
    description: 'Affiche les statistiques de votre serveur',
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
    name: 'weekly-summary',
    description: 'Génère un résumé hebdomadaire de l\'activité',
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
    name: 'ai-summary',
    description: 'Génère un résumé intelligent avec IA (nécessite clé API)',
    execute: async (interaction, client) => {
      await interaction.deferReply();

      if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
        return interaction.editReply({
          content: '❌ Aucune clé API IA configurée. Ajoutez `GROQ_API_KEY` dans vos variables d\'environnement.\n💡 Groq est gratuit : https://console.groq.com',
        });
      }

      const summary = await getWeeklySummary(interaction.guild.id, client.supabase, true);

      if (!summary.aiSummary) {
        return interaction.editReply({
          content: '❌ Impossible de générer le résumé IA. Vérifiez votre configuration.',
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('🤖 Résumé intelligent (IA)')
        .setColor(0x9B59B6)
        .setDescription(summary.aiSummary)
        .addFields(
          { name: '📊 Stats de base', value: summary.description, inline: false }
        )
        .setTimestamp()
        .setFooter({ text: 'Community Intelligence Bot - Powered by AI' });

      await interaction.editReply({ embeds: [embed] });
    },
  },
  {
    name: 'recommendations',
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
];

