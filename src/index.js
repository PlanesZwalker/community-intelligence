import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
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
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Stocker Supabase dans le client pour y accéder partout
client.supabase = supabase;
client.commands = new Collection();

// Quand le bot est prêt
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`✅ Bot connecté en tant que ${readyClient.user.tag}`);
  
  // Enregistrer les commandes slash
  await registerCommands(client);
  
  console.log('✅ Commandes enregistrées');
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
  if (!interaction.isChatInputCommand()) return;
  
  await commandHandler(interaction, client);
});

// Gérer les erreurs
client.on(Events.Error, (error) => {
  console.error('❌ Erreur Discord:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
});

// Connecter le bot
client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error('❌ Erreur de connexion:', error);
  process.exit(1);
});

