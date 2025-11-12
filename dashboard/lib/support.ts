/**
 * Configuration du support Discord
 * 
 * Pour créer un lien d'invitation Discord permanent :
 * 1. Créez un serveur Discord dédié au support
 * 2. Allez dans Paramètres du serveur > Invitations
 * 3. Créez une invitation permanente
 * 4. Remplacez le lien ci-dessous par votre lien d'invitation
 */

export const SUPPORT_DISCORD_INVITE = process.env.NEXT_PUBLIC_SUPPORT_DISCORD_INVITE || 'https://discord.gg/community-intelligence';

/**
 * Lien vers le serveur Discord de support
 */
export function getSupportDiscordLink(): string {
  return SUPPORT_DISCORD_INVITE;
}

/**
 * Message d'aide pour le support Discord
 */
export function getSupportMessage(): string {
  return `Rejoignez notre serveur Discord de support : ${SUPPORT_DISCORD_INVITE}`;
}

