/**
 * Gestion du consentement IA conforme RGPD
 * Les fonctionnalités IA nécessitent un consentement explicite car les données sont envoyées à des services tiers
 */

/**
 * Vérifie si le serveur a donné son consentement pour l'utilisation de l'IA
 */
export async function hasAIConsent(guildId, supabase) {
  try {
    const { data, error } = await supabase
      .from('guild_ai_consent')
      .select('ai_consent_given')
      .eq('guild_id', guildId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erreur lors de la vérification du consentement IA:', error);
      return false;
    }

    return data?.ai_consent_given === true;
  } catch (error) {
    console.error('Exception lors de la vérification du consentement IA:', error);
    return false;
  }
}

/**
 * Donne le consentement IA pour un serveur
 */
export async function giveAIConsent(guildId, userId, provider = 'groq', supabase) {
  try {
    const { error } = await supabase
      .from('guild_ai_consent')
      .upsert({
        guild_id: guildId,
        ai_consent_given: true,
        ai_consent_date: new Date().toISOString(),
        ai_consent_user_id: userId,
        ai_provider: provider,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'guild_id'
      });

    if (error) {
      console.error('Erreur lors de l\'enregistrement du consentement IA:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception lors de l\'enregistrement du consentement IA:', error);
    return false;
  }
}

/**
 * Retire le consentement IA pour un serveur
 */
export async function revokeAIConsent(guildId, userId, supabase) {
  try {
    const { error } = await supabase
      .from('guild_ai_consent')
      .update({
        ai_consent_given: false,
        ai_consent_date: null,
        updated_at: new Date().toISOString(),
      })
      .eq('guild_id', guildId);

    if (error) {
      console.error('Erreur lors de la révocation du consentement IA:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception lors de la révocation du consentement IA:', error);
    return false;
  }
}

/**
 * Récupère les informations de consentement IA pour un serveur
 */
export async function getAIConsentInfo(guildId, supabase) {
  try {
    const { data, error } = await supabase
      .from('guild_ai_consent')
      .select('*')
      .eq('guild_id', guildId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erreur lors de la récupération du consentement IA:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception lors de la récupération du consentement IA:', error);
    return null;
  }
}

/**
 * Message d'avertissement RGPD pour les fonctionnalités IA
 */
export function getAIConsentWarningMessage() {
  return `⚠️ **Consentement IA requis (RGPD)**

Pour utiliser les fonctionnalités d'IA générative, vous devez donner votre consentement explicite car vos données seront envoyées à un service tiers (Groq, OpenAI, ou Anthropic) pour traitement.

**Ce qui est envoyé :**
- Contenu des messages de votre serveur
- Métadonnées (auteur, date, canal)

**Ce qui n'est PAS envoyé :**
- Informations personnelles identifiables
- Données de paiement
- Mots de passe ou tokens

**Utilisation des données :**
- Analyse et génération de résumés
- Analyse de sentiment
- Génération de recommandations
- Les données ne sont pas stockées par le service IA après traitement

**Votre droit :**
- Vous pouvez retirer votre consentement à tout moment avec \`/ci-ai-consent revoke\`
- Vos données ne seront plus envoyées à l'IA

**Pour activer :** Utilisez \`/ci-ai-consent give\` pour donner votre consentement.`;
}

