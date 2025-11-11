import { generateSummary } from './aiService.js';

/**
 * Génère un résumé hebdomadaire
 * Utilise l'IA si disponible, sinon retourne des stats basiques
 */
export async function getWeeklySummary(guildId, supabase, useAI = false) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Top membres actifs
    const { data: memberActivity } = await supabase
      .from('messages')
      .select('author_id, author_display_name')
      .eq('guild_id', guildId)
      .gte('created_at', sevenDaysAgo.toISOString());

    const memberCounts = {};
    memberActivity?.forEach(msg => {
      const name = msg.author_display_name || msg.author_id;
      memberCounts[name] = (memberCounts[name] || 0) + 1;
    });

    const topMembers = Object.entries(memberCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count], index) => `${index + 1}. ${name} (${count} messages)`)
      .join('\n') || 'Aucune activité';

    // Top canaux (on aurait besoin du nom du canal, mais on utilise l'ID pour l'instant)
    const { data: channelActivity } = await supabase
      .from('messages')
      .select('channel_id')
      .eq('guild_id', guildId)
      .gte('created_at', sevenDaysAgo.toISOString());

    const channelCounts = {};
    channelActivity?.forEach(msg => {
      channelCounts[msg.channel_id] = (channelCounts[msg.channel_id] || 0) + 1;
    });

    const topChannels = Object.entries(channelCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([channelId, count], index) => `${index + 1}. <#${channelId}> (${count} messages)`)
      .join('\n') || 'Aucune activité';

    // Questions sans réponse (approximation: questions qui ne sont pas des réponses)
    const { data: questions } = await supabase
      .from('messages')
      .select('content, message_id')
      .eq('guild_id', guildId)
      .eq('is_question', true)
      .eq('is_reply', false)
      .gte('created_at', sevenDaysAgo.toISOString())
      .limit(5);

    const unansweredQuestions = questions && questions.length > 0
      ? questions.map((q, i) => `${i + 1}. ${q.content.substring(0, 100)}${q.content.length > 100 ? '...' : ''}`).join('\n\n')
      : 'Aucune question détectée';

    const totalMessages = memberActivity?.length || 0;

    // Si l'IA est activée et configurée, générer un résumé intelligent
    let aiSummary = null;
    if (useAI && process.env.GROQ_API_KEY) {
      try {
        console.log('🤖 Tentative de génération de résumé IA...');
        // Pour l'IA, récupérer TOUS les messages disponibles (pas seulement les 7 derniers jours)
        // Cela permet d'analyser l'historique synchronisé même s'il est plus ancien
        const { data: recentMessages, error: queryError } = await supabase
          .from('messages')
          .select('content, author_display_name')
          .eq('guild_id', guildId)
          .order('created_at', { ascending: false })
          .limit(100);

        if (queryError) {
          console.error('❌ Erreur lors de la récupération des messages:', queryError);
        } else {
          console.log(`📊 Messages récupérés pour IA: ${recentMessages?.length || 0}`);
          
          if (recentMessages && recentMessages.length > 0) {
            console.log('🤖 Appel à generateSummary...');
            aiSummary = await generateSummary(recentMessages, process.env.AI_PROVIDER || 'groq');
            console.log(`✅ Résumé IA généré (longueur: ${aiSummary?.length || 0} caractères)`);
          } else {
            console.log('⚠️ Aucun message récent trouvé pour générer le résumé IA');
          }
        }
      } catch (error) {
        console.error('❌ Erreur génération IA:', error);
        console.error('   Message:', error.message);
        console.error('   Stack:', error.stack);
        // Ne pas définir aiSummary si erreur, pour que le code appelant puisse détecter l'échec
        aiSummary = null;
      }
    } else {
      console.log('⚠️ IA non activée ou clé API manquante');
      console.log(`   useAI: ${useAI}, GROQ_API_KEY: ${!!process.env.GROQ_API_KEY}`);
    }

    return {
      description: `📊 Activité de la semaine dernière: **${totalMessages} messages** au total`,
      topMembers,
      topChannels,
      unansweredQuestions,
      aiSummary, // Résumé IA si disponible
    };
  } catch (error) {
    console.error('Erreur dans getWeeklySummary:', error);
    return {
      description: '❌ Erreur lors de la génération du résumé',
      topMembers: 'N/A',
      topChannels: 'N/A',
      unansweredQuestions: 'N/A',
    };
  }
}

