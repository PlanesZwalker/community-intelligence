import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import express from 'express';
import { messageHandler } from './handlers/messageHandler.js';
import { commandHandler } from './handlers/commandHandler.js';
import { registerCommands } from './utils/registerCommands.js';
import { checkConfig } from './utils/checkConfig.js';
import { syncHistory } from './utils/syncHistory.js';
import { updateAllChannelCounters } from './utils/channelCounters.js';
import { trackVoiceSession } from './utils/voiceAnalytics.js';
import { analyzeNewMemberInterests, sendWelcomeMessage } from './utils/onboarding.js';
import { handleStripeWebhook } from './utils/stripe.js';

// Charger les variables d'environnement
config();

// Vérifier la configuration
if (!checkConfig()) {
  process.exit(1);
}

// Initialiser le client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates, // Pour tracker l'activité vocale
  ],
});

// Initialiser Supabase avec validation stricte
const supabaseUrlRaw = process.env.SUPABASE_URL;
const supabaseKeyRaw = process.env.SUPABASE_KEY;

// Logs de débogage pour Render
console.log('🔍 Debug - Variables d\'environnement:');
console.log('   SUPABASE_URL existe:', !!supabaseUrlRaw);
console.log('   SUPABASE_URL longueur:', supabaseUrlRaw?.length || 0);
console.log('   SUPABASE_URL (premiers 50 chars):', supabaseUrlRaw?.substring(0, 50) || 'NON DÉFINI');
console.log('   SUPABASE_KEY existe:', !!supabaseKeyRaw);
console.log('   SUPABASE_KEY longueur:', supabaseKeyRaw?.length || 0);

const supabaseUrl = supabaseUrlRaw?.trim();
const supabaseKey = supabaseKeyRaw?.trim();

if (!supabaseUrl || supabaseUrl === '') {
  console.error('❌ Erreur: SUPABASE_URL manquante ou vide');
  console.error('   Valeur brute:', supabaseUrlRaw || 'NON DÉFINI');
  console.error('   Valeur après trim:', supabaseUrl || 'VIDE');
  process.exit(1);
}

if (!supabaseKey || supabaseKey === '') {
  console.error('❌ Erreur: SUPABASE_KEY manquante ou vide');
  console.error('   Valeur brute existe:', !!supabaseKeyRaw);
  process.exit(1);
}

// Valider que SUPABASE_URL est une URL valide
try {
  const url = new URL(supabaseUrl);
  if (!url.protocol.startsWith('http')) {
    console.error('❌ Erreur: SUPABASE_URL doit commencer par http:// ou https://');
    console.error('   Valeur reçue:', supabaseUrl);
    process.exit(1);
  }
  console.log('✅ SUPABASE_URL validée:', url.origin);
} catch (error) {
  console.error('❌ Erreur: SUPABASE_URL n\'est pas une URL valide');
  console.error('   Valeur reçue:', supabaseUrl);
  console.error('   Erreur:', error.message);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Stocker Supabase dans le client pour y accéder partout
client.supabase = supabase;
client.commands = new Collection();

// Quand le bot est prêt
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`✅ Bot connecté en tant que ${readyClient.user.tag}`);
  
  // Enregistrer les commandes slash
  const commandsRegistered = await registerCommands(client);
  
  if (commandsRegistered) {
    console.log('✅ Commandes enregistrées');
  }
  
  // Afficher les fonctionnalités disponibles
  if (process.env.GROQ_API_KEY) {
    console.log('🤖 IA Groq activée - Commandes IA disponibles: /ci-ai-summary, /ci-recommendations');
  }
  
  console.log('✅ Bot prêt à analyser votre communauté!');
  
  // Synchroniser l'historique au démarrage (optionnel, peut être désactivé)
  // Note: Cela peut prendre du temps selon le nombre de serveurs/canaux
  if (process.env.SYNC_HISTORY_ON_START === 'true') {
    console.log('🔄 Synchronisation de l\'historique au démarrage activée...');
    // Lancer la synchronisation en arrière-plan (ne pas bloquer le bot)
    syncHistory(readyClient, supabase, {
      limit: 100, // 100 messages par canal
      maxChannels: 50, // Maximum 50 canaux par serveur
      delayBetweenChannels: 1000, // 1 seconde entre chaque canal
    }).catch(error => {
      console.error('❌ Erreur lors de la synchronisation automatique:', error);
    });
  } else {
    console.log('💡 Astuce: Utilisez /ci-sync-history pour synchroniser l\'historique manuellement');
  }

  // Mettre à jour les channel counters toutes les 5 minutes
  console.log('🔄 Système de mise à jour des channel counters activé (toutes les 5 minutes)');
  setInterval(async () => {
    try {
      for (const [guildId, guild] of readyClient.guilds.cache) {
        await updateAllChannelCounters(guild, supabase);
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour channel counters:', error);
    }
  }, 5 * 60 * 1000); // 5 minutes

  // Mettre à jour immédiatement au démarrage (après 30 secondes)
  setTimeout(async () => {
    try {
      for (const [guildId, guild] of readyClient.guilds.cache) {
        await updateAllChannelCounters(guild, supabase);
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour initiale channel counters:', error);
    }
  }, 30000); // 30 secondes après le démarrage
});

// Gérer les nouveaux membres
client.on(Events.GuildMemberAdd, async (member) => {
  try {
    // Attendre quelques secondes pour que le membre envoie quelques messages
    setTimeout(async () => {
      const interests = await analyzeNewMemberInterests(
        member.user.id,
        member.guild.id,
        supabase,
        member.guild
      );

      await sendWelcomeMessage(
        member,
        interests.interests,
        interests.suggestedChannels,
        interests.suggestedRoles,
        member.guild
      );
    }, 30000); // 30 secondes après l'arrivée
  } catch (error) {
    console.error('Erreur onboarding nouveau membre:', error);
  }
});

// Gérer les messages
client.on(Events.MessageCreate, async (message) => {
  // Ignorer les messages du bot
  if (message.author.bot) return;
  
  await messageHandler(message, supabase);
});

// Gérer l'activité vocale
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  try {
    // Ignorer les bots
    if (newState.member?.user.bot || oldState.member?.user.bot) return;

    const userId = newState.member?.user.id || oldState.member?.user.id;
    const guildId = newState.guild.id;

    // Utilisateur rejoint un canal vocal
    if (!oldState.channelId && newState.channelId) {
      await trackVoiceSession(
        userId,
        guildId,
        newState.channelId,
        new Date(),
        null, // Session en cours
        supabase
      );
    }

    // Utilisateur quitte un canal vocal
    if (oldState.channelId && !newState.channelId) {
      // Trouver la session en cours
      const { data: ongoingSession } = await supabase
        .from('voice_sessions')
        .select('joined_at')
        .eq('user_id', userId)
        .eq('guild_id', guildId)
        .eq('channel_id', oldState.channelId)
        .is('left_at', null)
        .order('joined_at', { ascending: false })
        .limit(1)
        .single();

      if (ongoingSession) {
        const joinedAt = new Date(ongoingSession.joined_at);
        await trackVoiceSession(
          userId,
          guildId,
          oldState.channelId,
          joinedAt,
          new Date(),
          supabase
        );
      }
    }

    // Utilisateur change de canal vocal
    if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
      // Fermer l'ancienne session
      const { data: ongoingSession } = await supabase
        .from('voice_sessions')
        .select('joined_at')
        .eq('user_id', userId)
        .eq('guild_id', guildId)
        .eq('channel_id', oldState.channelId)
        .is('left_at', null)
        .order('joined_at', { ascending: false })
        .limit(1)
        .single();

      if (ongoingSession) {
        const joinedAt = new Date(ongoingSession.joined_at);
        await trackVoiceSession(
          userId,
          guildId,
          oldState.channelId,
          joinedAt,
          new Date(),
          supabase
        );
      }

      // Créer une nouvelle session
      await trackVoiceSession(
        userId,
        guildId,
        newState.channelId,
        new Date(),
        null,
        supabase
      );
    }
  } catch (error) {
    console.error('Erreur tracking vocal:', error);
  }
});

// Gérer les interactions (commandes slash)
client.on(Events.InteractionCreate, async (interaction) => {
  console.log('🔔 Interaction reçue:', interaction.type, interaction.isChatInputCommand() ? `Commande: /${interaction.commandName}` : 'Autre type');
  
  // Vérifier que c'est une commande chat valide
  if (!interaction.isChatInputCommand()) {
    console.log('   ⏭️ Pas une commande chat, ignorée');
    return;
  }
  
  // Vérifier que l'interaction a les propriétés nécessaires
  if (!interaction.commandName) {
    console.warn('⚠️ Interaction sans commandName reçue');
    return;
  }
  
  if (!interaction.guild) {
    console.warn('⚠️ Commande utilisée en DM (non supporté):', interaction.commandName);
    if (interaction.isRepliable()) {
      return interaction.reply({
        content: '❌ Les commandes doivent être utilisées dans un serveur Discord.',
        ephemeral: true,
      }).catch(err => console.error('Erreur lors de la réponse:', err));
    }
    return;
  }
  
  console.log(`   📍 Serveur: ${interaction.guild.name} (${interaction.guild.id})`);
  await commandHandler(interaction, client);
});

// Gérer les erreurs
client.on(Events.Error, (error) => {
  console.error('❌ Erreur Discord:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
});

// Créer le serveur Express pour les endpoints HTTP
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Endpoint pour Terms of Service
app.get('/terms', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Terms of Service - Community Intelligence</title>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #5865F2; }
      </style>
    </head>
    <body>
      <h1>Terms of Service</h1>
      <p>By using Community Intelligence Bot, you agree to the following terms:</p>
      <ul>
        <li>The bot collects messages for analytics purposes only</li>
        <li>Data is stored securely on Supabase</li>
        <li>You can request data deletion at any time</li>
        <li>The bot is provided "as is" without warranty</li>
      </ul>
      <p>For the full license, see: <a href="https://github.com/PlanesZwalker/community-intelligence/blob/main/LICENSE">MIT License</a></p>
    </body>
    </html>
  `);
});

// Endpoint pour Privacy Policy
app.get('/privacy', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Privacy Policy - Community Intelligence</title>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #5865F2; }
      </style>
    </head>
    <body>
      <h1>Privacy Policy</h1>
      <h2>Data Collection</h2>
      <p>We collect:</p>
      <ul>
        <li>Discord messages (content, author, timestamp, channel)</li>
        <li>Metadata (username, reaction count, attachments)</li>
        <li>Statistics (member activity, channel usage)</li>
      </ul>
      <h2>Data Storage</h2>
      <p>Data is stored securely on Supabase (PostgreSQL) with encryption in transit and at rest.</p>
      <h2>Data Deletion</h2>
      <p>You can request data deletion at any time by contacting the bot administrator.</p>
      <p>For more details, see: <a href="https://github.com/PlanesZwalker/community-intelligence/blob/main/PRIVACY_POLICY.md">Full Privacy Policy</a></p>
    </body>
    </html>
  `);
});

// Endpoint pour Linked Roles Verification (placeholder)
app.get('/verify', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Verification - Community Intelligence</title>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
        h1 { color: #5865F2; }
      </style>
    </head>
    <body>
      <h1>Linked Roles Verification</h1>
      <p>This endpoint is for Discord Linked Roles verification.</p>
      <p>Feature coming soon!</p>
    </body>
    </html>
  `);
});

// Endpoint pour les interactions Discord HTTP (optionnel)
// ⚠️ Si vous utilisez cet endpoint, laissez "Interactions Endpoint URL" vide dans Discord
// pour continuer à utiliser Gateway, ou configurez-le pour utiliser HTTP
app.post('/discord', async (req, res) => {
  // Pour l'instant, on retourne une erreur car on utilise Gateway
  // Si vous voulez utiliser HTTP interactions, il faut implémenter la vérification
  // et le traitement des interactions HTTP
  res.status(501).json({ 
    error: 'HTTP interactions not implemented. This bot uses Gateway interactions.' 
  });
});

// Health check pour Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', bot: client.user?.tag || 'not ready' });
});

// Webhook Stripe pour les paiements
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('❌ Configuration Stripe manquante');
    return res.status(500).send('Configuration Stripe manquante');
  }

  try {
    const stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    // Traiter le webhook
    await handleStripeWebhook(event, supabase);

    res.json({ received: true });
  } catch (err) {
    console.error('❌ Erreur webhook Stripe:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Démarrer le serveur Express
app.listen(PORT, () => {
  console.log(`🌐 Serveur HTTP démarré sur le port ${PORT}`);
  console.log(`📄 Terms: http://localhost:${PORT}/terms`);
  console.log(`🔒 Privacy: http://localhost:${PORT}/privacy`);
  console.log(`✅ Verify: http://localhost:${PORT}/verify`);
});

// Connecter le bot
client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error('❌ Erreur de connexion:', error);
  process.exit(1);
});

