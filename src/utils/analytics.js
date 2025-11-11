/**
 * Fonctions d'analyse des données
 */

export async function getStats(guildId, supabase) {
  try {
    // Messages totaux
    const { count: totalMessages } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('guild_id', guildId);

    // Membres actifs (uniques sur les 7 derniers jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentMessages } = await supabase
      .from('messages')
      .select('author_id')
      .eq('guild_id', guildId)
      .gte('created_at', sevenDaysAgo.toISOString());

    const activeMembers = new Set(recentMessages?.map(m => m.author_id) || []).size;

    // Canaux actifs
    const { data: channels } = await supabase
      .from('messages')
      .select('channel_id')
      .eq('guild_id', guildId)
      .gte('created_at', sevenDaysAgo.toISOString());

    const activeChannels = new Set(channels?.map(c => c.channel_id) || []).size;

    // Questions posées
    const { count: totalQuestions } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('guild_id', guildId)
      .eq('is_question', true)
      .gte('created_at', sevenDaysAgo.toISOString());

    // Messages avec réponses (approximation: messages qui sont des réponses)
    const { count: answeredMessages } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('guild_id', guildId)
      .eq('is_reply', true)
      .gte('created_at', sevenDaysAgo.toISOString());

    const answerRate = totalQuestions > 0
      ? Math.round((answeredMessages / totalQuestions) * 100)
      : 0;

    // Messages populaires (avec réactions)
    const { count: popularMessages } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('guild_id', guildId)
      .gt('reaction_count', 0)
      .gte('created_at', sevenDaysAgo.toISOString());

    return {
      totalMessages: totalMessages || 0,
      activeMembers: activeMembers || 0,
      activeChannels: activeChannels || 0,
      totalQuestions: totalQuestions || 0,
      answerRate: answerRate || 0,
      popularMessages: popularMessages || 0,
    };
  } catch (error) {
    console.error('Erreur dans getStats:', error);
    return {
      totalMessages: 0,
      activeMembers: 0,
      activeChannels: 0,
      totalQuestions: 0,
      answerRate: 0,
      popularMessages: 0,
    };
  }
}

