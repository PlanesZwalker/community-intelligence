/**
 * Service d'IA générative - Supporte plusieurs providers
 * 
 * Options disponibles :
 * - Groq (GRATUIT) - Modèles Llama open-source, très rapide
 * - Hugging Face (GRATUIT avec limites) - Modèles open-source
 * - OpenAI (payant avec crédits gratuits)
 * - Anthropic Claude (payant avec crédits gratuits)
 */

/**
 * Génère un résumé intelligent des conversations
 */
export async function generateSummary(messages, provider = 'groq') {
  const context = messages
    .slice(-50) // Derniers 50 messages pour le contexte
    .map(m => `${m.author_display_name}: ${m.content}`)
    .join('\n');

  const prompt = `Analyse ces conversations Discord et génère un résumé intelligent :
- Sujets principaux discutés
- Tendances et patterns
- Questions récurrentes
- Sentiment général de la communauté

Conversations :
${context}

Résumé (max 500 mots) :`;

  try {
    switch (provider.toLowerCase()) {
      case 'groq':
        return await generateWithGroq(prompt);
      case 'huggingface':
        return await generateWithHuggingFace(prompt);
      case 'openai':
        return await generateWithOpenAI(prompt);
      case 'claude':
        return await generateWithClaude(prompt);
      default:
        return await generateWithGroq(prompt);
    }
  } catch (error) {
    console.error(`Erreur avec ${provider}:`, error);
    return '❌ Erreur lors de la génération du résumé.';
  }
}

/**
 * Groq API - GRATUIT, très rapide, modèles Llama
 * Inscription : https://console.groq.com
 * Crédit gratuit : 14,400 requêtes/jour
 */
async function generateWithGroq(prompt) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY non configurée');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile', // ou 'mixtral-8x7b-32768'
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en analyse de communautés Discord. Génère des résumés clairs et actionnables.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'Aucune réponse générée';
}

/**
 * Hugging Face Inference API - GRATUIT avec limites
 * Inscription : https://huggingface.co
 * Crédit gratuit : 30,000 requêtes/mois
 */
async function generateWithHuggingFace(prompt) {
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error('HUGGINGFACE_API_KEY non configurée');
  }

  const response = await fetch(
    'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API error: ${error}`);
  }

  const data = await response.json();
  return data[0]?.generated_text || 'Aucune réponse générée';
}

/**
 * OpenAI API - Payant mais crédits gratuits à l'inscription
 * Inscription : https://platform.openai.com
 * Crédit gratuit : ~5$ à l'inscription
 */
async function generateWithOpenAI(prompt) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY non configurée');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo', // Moins cher que GPT-4
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en analyse de communautés Discord.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'Aucune réponse générée';
}

/**
 * Anthropic Claude API - Payant mais crédits gratuits
 * Inscription : https://console.anthropic.com
 * Crédit gratuit : 5$ à l'inscription
 */
async function generateWithClaude(prompt) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY non configurée');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307', // Moins cher que Claude 3 Opus
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  return data.content[0]?.text || 'Aucune réponse générée';
}

/**
 * Détecte le sentiment d'un message
 */
export async function detectSentiment(message, provider = 'groq') {
  const prompt = `Analyse le sentiment de ce message Discord (positif, neutre, négatif) et explique pourquoi en une phrase :

Message: "${message}"

Réponse (format: sentiment|explication) :`;

  try {
    const response = await generateSummary([{ content: message, author_display_name: 'User' }], provider);
    const [sentiment, explanation] = response.split('|');
    return {
      sentiment: sentiment?.trim().toLowerCase() || 'neutre',
      explanation: explanation?.trim() || '',
    };
  } catch (error) {
    console.error('Erreur détection sentiment:', error);
    return { sentiment: 'neutre', explanation: '' };
  }
}

/**
 * Génère des recommandations d'engagement
 */
export async function generateEngagementRecommendations(stats, provider = 'groq') {
  const prompt = `En tant qu'expert en community management, génère 3 recommandations concrètes et actionnables pour améliorer l'engagement sur ce serveur Discord :

Statistiques :
- Messages totaux : ${stats.totalMessages}
- Membres actifs : ${stats.activeMembers}
- Questions posées : ${stats.totalQuestions}
- Taux de réponse : ${stats.answerRate}%

Réponds avec exactement 3 recommandations, une par ligne, format : "1. [recommandation]"`;

  try {
    let response;
    switch (provider.toLowerCase()) {
      case 'groq':
        response = await generateWithGroq(prompt);
        break;
      case 'huggingface':
        response = await generateWithHuggingFace(prompt);
        break;
      case 'openai':
        response = await generateWithOpenAI(prompt);
        break;
      case 'claude':
        response = await generateWithClaude(prompt);
        break;
      default:
        response = await generateWithGroq(prompt);
    }

    // Parser les recommandations
    const recommendations = response
      .split(/\d+\./)
      .map(r => r.trim())
      .filter(r => r.length > 0 && !r.match(/^(recommandation|statistique)/i))
      .slice(0, 3);

    if (recommendations.length > 0) {
      return recommendations;
    }

    // Fallback si le parsing échoue
    return [
      `Augmenter l'engagement avec ${stats.activeMembers} membres actifs`,
      `Répondre aux ${stats.totalQuestions} questions posées pour améliorer le taux de réponse`,
      'Créer des événements réguliers et des discussions thématiques'
    ];
  } catch (error) {
    console.error('Erreur génération recommandations:', error);
    return [
      `Analyser les données de ${stats.totalMessages} messages pour identifier les sujets populaires`,
      `Engager les ${stats.activeMembers} membres actifs avec des questions ouvertes`,
      `Répondre aux ${stats.totalQuestions} questions pour améliorer le taux de réponse de ${stats.answerRate}%`
    ];
  }
}

