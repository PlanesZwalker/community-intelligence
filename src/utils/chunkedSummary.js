/**
 * Système de résumé intelligent avec chunking pour gérer les grandes quantités de messages
 * Divise les messages en chunks, résume chaque chunk, puis résume les résumés
 */

import { generateWithGroq } from './aiService.js';

/**
 * Estime le nombre de tokens approximatif d'un texte
 * Approximation : ~4 caractères = 1 token pour l'anglais, ~2 caractères = 1 token pour le français
 */
function estimateTokens(text) {
  // Approximation conservatrice : 3 caractères = 1 token
  return Math.ceil(text.length / 3);
}

/**
 * Divise les messages en chunks de taille appropriée pour l'API Groq
 * Limite : ~25k tokens par chunk (pour laisser de la marge sur la limite de 32k)
 */
function chunkMessages(messages, maxTokensPerChunk = 25000) {
  const chunks = [];
  let currentChunk = [];
  let currentTokens = 0;

  for (const message of messages) {
    const messageText = `${message.author_display_name || 'User'}: ${message.content}`;
    const messageTokens = estimateTokens(messageText);

    // Si ajouter ce message dépasse la limite, créer un nouveau chunk
    if (currentTokens + messageTokens > maxTokensPerChunk && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = [message];
      currentTokens = messageTokens;
    } else {
      currentChunk.push(message);
      currentTokens += messageTokens;
    }
  }

  // Ajouter le dernier chunk s'il n'est pas vide
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Résume un chunk de messages
 */
async function summarizeChunk(chunk, chunkIndex, totalChunks) {
  const context = chunk
    .map(m => `${m.author_display_name || 'User'}: ${m.content}`)
    .join('\n');

  const prompt = `Analyse ces conversations Discord (chunk ${chunkIndex + 1}/${totalChunks}) et génère un résumé structuré :

**Instructions :**
- Identifie les sujets principaux discutés
- Note les tendances et patterns importants
- Liste les questions récurrentes
- Détecte le sentiment général (positif/neutre/négatif)
- Identifie les membres les plus actifs et leurs contributions

**Conversations :**
${context}

**Résumé (format structuré, max 600 mots, détaillé) :**`;

  try {
    const summary = await generateWithGroq(prompt, 1500); // Plus de tokens pour un résumé détaillé
    console.log(`   ✅ Chunk ${chunkIndex + 1}/${totalChunks} résumé (${summary.length} caractères)`);
    return summary;
  } catch (error) {
    console.error(`   ❌ Erreur lors du résumé du chunk ${chunkIndex + 1}:`, error.message);
    // Retourner un résumé basique si l'IA échoue
    return `Chunk ${chunkIndex + 1}: ${chunk.length} messages analysés. Erreur lors du résumé IA.`;
  }
}

/**
 * Résume récursivement plusieurs résumés de chunks
 */
async function summarizeSummaries(summaries, level = 1) {
  if (summaries.length === 0) {
    return 'Aucun résumé disponible.';
  }

  if (summaries.length === 1) {
    return summaries[0];
  }

  // Si on a trop de résumés, les re-chunker
  const combinedText = summaries.join('\n\n---\n\n');
  const totalTokens = estimateTokens(combinedText);

  // Si le total dépasse la limite, créer des sous-chunks
  if (totalTokens > 25000) {
    console.log(`   🔄 Re-chunking ${summaries.length} résumés (niveau ${level})...`);
    const subChunks = chunkText(summaries.join('\n\n---\n\n'), 25000);
    const subSummaries = [];

    for (let i = 0; i < subChunks.length; i++) {
      const subSummary = await summarizeTextChunk(subChunks[i], i, subChunks.length, level);
      subSummaries.push(subSummary);
    }

    // Résumer récursivement les sous-résumés
    return await summarizeSummaries(subSummaries, level + 1);
  }

  // Sinon, résumer directement tous les résumés
  const prompt = `Tu es un expert en analyse de communautés Discord. 

Voici ${summaries.length} résumés partiels d'analyses de conversations Discord. Génère un résumé final complet et structuré qui synthétise toutes ces informations :

**Résumés partiels :**
${summaries.map((s, i) => `\n--- Résumé ${i + 1} ---\n${s}`).join('\n')}

**Instructions pour le résumé final :**
- Synthétise les sujets principaux de TOUTE la communauté
- Identifie les tendances générales et patterns récurrents
- Liste les questions les plus importantes et fréquentes
- Décris le sentiment général de la communauté (positif/neutre/négatif)
- Identifie les membres les plus actifs et leurs contributions clés
- Ajoute des insights actionnables pour améliorer l'engagement

**Format du résumé :**
- Introduction (contexte général)
- Sujets principaux discutés
- Tendances et patterns
- Questions récurrentes
- Sentiment de la communauté
- Membres actifs clés
- Recommandations

**Résumé final (max 800 mots, détaillé et structuré) :**`;

  try {
    const finalSummary = await generateWithGroq(prompt, 2000); // Plus de tokens pour le résumé final
    console.log(`   ✅ Résumé final généré (niveau ${level}, ${finalSummary.length} caractères)`);
    return finalSummary;
  } catch (error) {
    console.error(`   ❌ Erreur lors du résumé final (niveau ${level}):`, error.message);
    // Fallback : concaténer les résumés
    return summaries.join('\n\n---\n\n');
  }
}

/**
 * Divise un texte en chunks de taille appropriée
 */
function chunkText(text, maxTokensPerChunk) {
  const chunks = [];
  const sentences = text.split(/\n\n/); // Diviser par paragraphes
  
  let currentChunk = [];
  let currentTokens = 0;

  for (const sentence of sentences) {
    const sentenceTokens = estimateTokens(sentence);

    if (currentTokens + sentenceTokens > maxTokensPerChunk && currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n\n'));
      currentChunk = [sentence];
      currentTokens = sentenceTokens;
    } else {
      currentChunk.push(sentence);
      currentTokens += sentenceTokens;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n\n'));
  }

  return chunks;
}

/**
 * Résume un chunk de texte (pour les résumés récursifs)
 */
async function summarizeTextChunk(textChunk, chunkIndex, totalChunks, level) {
  const prompt = `Résume ce texte d'analyse de communauté Discord (chunk ${chunkIndex + 1}/${totalChunks}, niveau ${level}) :

${textChunk}

Résumé concis (max 300 mots) :`;

  try {
    const summary = await generateWithGroq(prompt, 800);
    return summary;
  } catch (error) {
    console.error(`   ❌ Erreur résumé texte chunk ${chunkIndex + 1}:`, error.message);
    return textChunk.substring(0, 500) + '...';
  }
}

/**
 * Génère un résumé intelligent de TOUS les messages avec chunking automatique
 */
export async function generateChunkedSummary(allMessages, provider = 'groq') {
  if (!allMessages || allMessages.length === 0) {
    throw new Error('Aucun message à analyser');
  }

  console.log(`📊 Génération de résumé avec chunking pour ${allMessages.length} messages...`);

  // Diviser les messages en chunks
  const chunks = chunkMessages(allMessages);
  console.log(`   📦 Messages divisés en ${chunks.length} chunks`);

  if (chunks.length === 0) {
    throw new Error('Aucun chunk créé');
  }

  // Résumer chaque chunk en parallèle (avec limite pour éviter de surcharger l'API)
  const chunkSummaries = [];
  const maxConcurrent = 3; // Limiter à 3 requêtes simultanées

  for (let i = 0; i < chunks.length; i += maxConcurrent) {
    const batch = chunks.slice(i, i + maxConcurrent);
    const batchPromises = batch.map((chunk, batchIndex) => 
      summarizeChunk(chunk, i + batchIndex, chunks.length)
    );
    
    const batchResults = await Promise.all(batchPromises);
    chunkSummaries.push(...batchResults);

    // Petit délai entre les batches pour respecter les rate limits
    if (i + maxConcurrent < chunks.length) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 seconde entre batches
    }
  }

  console.log(`   ✅ ${chunkSummaries.length} chunks résumés`);

  // Résumer récursivement les résumés de chunks
  console.log(`   🔄 Synthèse des résumés...`);
  const finalSummary = await summarizeSummaries(chunkSummaries);

  console.log(`   ✅ Résumé final généré (${finalSummary.length} caractères)`);
  return finalSummary;
}

