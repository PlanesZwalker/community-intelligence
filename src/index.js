import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import express from 'express';
import { messageHandler } from './handlers/messageHandler.js';
import { commandHandler } from './handlers/commandHandler.js';
import { registerCommands } from './utils/registerCommands.js';
import { checkConfig } from './utils/checkConfig.js';

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
  ],
});

// Initialiser Supabase
const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_KEY?.trim();

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erreur: SUPABASE_URL ou SUPABASE_KEY manquants');
  console.error('   SUPABASE_URL:', supabaseUrl || 'NON DÉFINI');
  console.error('   SUPABASE_KEY:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NON DÉFINI');
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
  await registerCommands(client);
  
  console.log('✅ Commandes enregistrées');
  
  // Afficher les fonctionnalités disponibles
  if (process.env.GROQ_API_KEY) {
    console.log('🤖 IA Groq activée - Commandes IA disponibles: /ai-summary, /recommendations');
  }
  
  console.log('✅ Bot prêt à analyser votre communauté!');
});

// Gérer les messages
client.on(Events.MessageCreate, async (message) => {
  // Ignorer les messages du bot
  if (message.author.bot) return;
  
  await messageHandler(message, supabase);
});

// Gérer les interactions (commandes slash)
client.on(Events.InteractionCreate, async (interaction) => {
  // Vérifier que c'est une commande chat valide
  if (!interaction.isChatInputCommand()) return;
  
  // Vérifier que l'interaction a les propriétés nécessaires
  if (!interaction.commandName || !interaction.guild) {
    console.warn('⚠️ Interaction incomplète reçue:', {
      commandName: interaction.commandName,
      hasGuild: !!interaction.guild,
    });
    return;
  }
  
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

