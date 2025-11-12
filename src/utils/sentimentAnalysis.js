/**
 * Analyse de sentiment avec Groq AI
 * Détecte le sentiment (positif, neutre, négatif) des messages
 */

import { generateWithGroq } from './aiService.js';

/**
 * Analyse le sentiment d'un message unique
 */
export async function analyzeMessageSentiment(messageContent) {
  const prompt = `Analyse le sentiment de ce message Discord et réponds UNIQUEMENT avec un des mots suivants : "positif", "neutre", ou "négatif".

Message: "${messageContent.substring(0, 500)}"

Réponse (un seul mot) :`;

  try {
    const response = await generateWithGroq(prompt, 50); // Peu de tokens nécessaires
    const sentiment = response.trim().toLowerCase();
    
    // Normaliser la réponse
    if (sentiment.includes('positif') || sentiment.includes('positive')) {
      return 'positif';
    } else if (sentiment.includes('négatif') || sentiment.includes('negative') || sentiment.includes('negatif')) {
      return 'négatif';
    } else {
      return 'neutre';
    }
  } catch (error) {
    console.error('Erreur analyse sentiment:', error);
    return 'neutre'; // Fallback
  }
}

/**
 * Analyse le sentiment d'un ensemble de messages
 */
export async function analyzeMessagesSentiment(messages, supabase, guildId, timeWindowHours = 24) {
  if (!messages || messages.length === 0) {
    return {
      positif: 0,
      neutre: 0,
      négatif: 0,
      total: 0,
      sentiment: 'neutre',
    };
  }

  // Analyser les messages par batch pour éviter de surcharger l'API
  const batchSize = 10;
  const sentiments = {
    positif: 0,
    neutre: 0,
    négatif: 0,
  };

  // Échantillonner les messages si trop nombreux (max 50 pour analyse)
  const sampleMessages = messages.slice(0, 50);
  
  for (let i = 0; i < sampleMessages.length; i += batchSize) {
    const batch = sampleMessages.slice(i, i + batchSize);
    
    // Analyser chaque message du batch
    const batchPromises = batch.map(msg => analyzeMessageSentiment(msg.content));
    const batchResults = await Promise.all(batchPromises);
    
    // Compter les sentiments
    batchResults.forEach(sentiment => {
      sentiments[sentiment] = (sentiments[sentiment] || 0) + 1;
    });

    // Délai entre batches pour respecter les rate limits
    if (i + batchSize < sampleMessages.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const total = sentiments.positif + sentiments.neutre + sentiments.négatif;
  
  // Déterminer le sentiment dominant
  let dominantSentiment = 'neutre';
  if (sentiments.positif > sentiments.négatif && sentiments.positif > sentiments.neutre) {
    dominantSentiment = 'positif';
  } else if (sentiments.négatif > sentiments.positif && sentiments.négatif > sentiments.neutre) {
    dominantSentiment = 'négatif';
  }

  return {
    positif: sentiments.positif,
    neutre: sentiments.neutre,
    négatif: sentiments.négatif,
    total,
    sentiment: dominantSentiment,
    positifPercent: total > 0 ? Math.round((sentiments.positif / total) * 100) : 0,
    neutrePercent: total > 0 ? Math.round((sentiments.neutre / total) * 100) : 0,
    négatifPercent: total > 0 ? Math.round((sentiments.négatif / total) * 100) : 0,
  };
}

/**
 * Analyse le sentiment d'un canal spécifique
 */
export async function analyzeChannelSentiment(guildId, channelId, supabase, timeWindowHours = 24) {
  const timeWindow = new Date();
  timeWindow.setHours(timeWindow.getHours() - timeWindowHours);

  const { data: messages, error } = await supabase
    .from('messages')
    .select('content')
    .eq('guild_id', guildId)
    .eq('channel_id', channelId)
    .gte('created_at', timeWindow.toISOString())
    .order('created_at', { ascending: false })
    .limit(100);

  if (error || !messages || messages.length === 0) {
    return {
      positif: 0,
      neutre: 0,
      négatif: 0,
      total: 0,
      sentiment: 'neutre',
      message: 'Aucun message à analyser',
    };
  }

  return await analyzeMessagesSentiment(messages, supabase, guildId, timeWindowHours);
}

/**
 * Analyse le sentiment global du serveur
 */
export async function analyzeGuildSentiment(guildId, supabase, timeWindowHours = 24) {
  const timeWindow = new Date();
  timeWindow.setHours(timeWindow.getHours() - timeWindowHours);

  const { data: messages, error } = await supabase
    .from('messages')
    .select('content')
    .eq('guild_id', guildId)
    .gte('created_at', timeWindow.toISOString())
    .order('created_at', { ascending: false })
    .limit(200);

  if (error || !messages || messages.length === 0) {
    return {
      positif: 0,
      neutre: 0,
      négatif: 0,
      total: 0,
      sentiment: 'neutre',
      message: 'Aucun message à analyser',
    };
  }

  return await analyzeMessagesSentiment(messages, supabase, guildId, timeWindowHours);
}

