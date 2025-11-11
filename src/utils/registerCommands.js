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
    console.log(`   Client ID: ${process.env.DISCORD_CLIENT_ID}`);
    console.log(`   Bot connecté: ${client.user?.tag} (ID: ${client.user?.id})`);

    // Vérifier que le Client ID correspond au bot connecté
    if (client.user?.id !== process.env.DISCORD_CLIENT_ID) {
      console.warn('⚠️ ATTENTION: Le DISCORD_CLIENT_ID ne correspond pas au bot connecté!');
      console.warn(`   Bot connecté ID: ${client.user?.id}`);
      console.warn(`   CLIENT_ID configuré: ${process.env.DISCORD_CLIENT_ID}`);
      console.warn('   Le bot continuera à fonctionner, mais les commandes doivent être enregistrées manuellement.');
      console.warn('   Solution: Vérifiez que DISCORD_TOKEN et DISCORD_CLIENT_ID correspondent à la même application Discord.');
      return false; // Ne pas essayer d'enregistrer si les IDs ne correspondent pas
    }

    // Enregistrer globalement (peut prendre jusqu'à 1h pour se propager)
    // Pour le développement, utilisez Routes.applicationGuildCommands avec un guild_id
    const route = process.env.GUILD_ID
      ? Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.GUILD_ID)
      : Routes.applicationCommands(process.env.DISCORD_CLIENT_ID);

    await rest.put(route, { body: commandsData });

    console.log('✅ Commandes enregistrées avec succès!');
    console.log(`   Commandes enregistrées: ${commandsData.map(c => c.name).join(', ')}`);
    return true; // Succès
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement des commandes:', error.message);
    
    if (error.code === 20012) {
      console.error('⚠️ Erreur 20012: Le token Discord ne correspond pas au CLIENT_ID');
      console.error('   Solution: Vérifiez dans Render que:');
      console.error('   1. DISCORD_TOKEN correspond au bot de l\'application');
      console.error('   2. DISCORD_CLIENT_ID correspond à la même application');
      console.error('   3. Les deux doivent venir de la même application Discord Developer Portal');
      console.error('');
      console.error('   Le bot continuera à fonctionner, mais vous devrez enregistrer les commandes manuellement:');
      console.error('   Discord Developer Portal > Application > Slash Commands > New Command');
    }
    
    // Le bot continue à fonctionner même si l'enregistrement échoue
    // Les commandes peuvent être enregistrées manuellement via le Discord Developer Portal
    return false; // Échec
  }
}

