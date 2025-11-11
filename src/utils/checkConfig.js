/**
 * Vérifie que toutes les variables d'environnement sont configurées
 */
export function checkConfig() {
  const required = [
    'DISCORD_TOKEN',
    'DISCORD_CLIENT_ID',
    'SUPABASE_URL',
    'SUPABASE_KEY',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Variables d\'environnement manquantes:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n💡 Créez un fichier .env avec toutes les variables nécessaires.');
    console.error('   Consultez env.example pour voir le format attendu.\n');
    return false;
  }

  console.log('✅ Configuration validée');
  return true;
}

