import { REST, Routes } from 'discord.js';
import { commands } from '../handlers/commandHandler.js';

/**
 * Enregistre les commandes slash sur Discord
 */
export async function registerCommands(client) {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);

  const commandsData = commands.map(cmd => ({
    name: cmd.name,
    description: cmd.description,
  }));

  // Stocker les commandes dans le client
  for (const command of commands) {
    client.commands.set(command.name, command);
  }

  try {
    console.log('🔄 Enregistrement des commandes...');

    // Enregistrer globalement (peut prendre jusqu'à 1h pour se propager)
    // Pour le développement, utilisez Routes.applicationGuildCommands avec un guild_id
    const route = process.env.GUILD_ID
      ? Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.GUILD_ID)
      : Routes.applicationCommands(process.env.DISCORD_CLIENT_ID);

    await rest.put(route, { body: commandsData });

    console.log('✅ Commandes enregistrées avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement des commandes:', error);
  }
}

