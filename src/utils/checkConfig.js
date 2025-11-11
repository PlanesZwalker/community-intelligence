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
    console.error('\n💡 Créez un fichier .env avec toutes les variables nécessaires.\n');
    return false;
  }

  console.log('✅ Configuration validée');
  
  // Vérifier la configuration IA (optionnel)
  if (process.env.GROQ_API_KEY) {
    console.log('🤖 IA Groq détectée - Fonctionnalités IA activées');
  } else if (process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY) {
    console.log('🤖 IA détectée - Fonctionnalités IA activées');
  } else {
    console.log('💡 Astuce: Ajoutez GROQ_API_KEY pour activer les fonctionnalités IA (gratuit)');
  }
  
  return true;
}

