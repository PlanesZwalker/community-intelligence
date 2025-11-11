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

  const missing = required.filter(key => !process.env[key] || process.env[key].trim() === '');

  if (missing.length > 0) {
    console.error('❌ Variables d\'environnement manquantes ou vides:');
    missing.forEach(key => {
      const value = process.env[key];
      console.error(`   - ${key}${value ? ` (vide ou invalide: "${value.substring(0, 20)}...")` : ' (non définie)'}`);
    });
    console.error('\n💡 Vérifiez vos variables d\'environnement dans Render:\n');
    console.error('   Render Dashboard > Your Service > Environment > Variables');
    console.error('   Assurez-vous que SUPABASE_URL commence par https://\n');
    return false;
  }

  // Vérifier que SUPABASE_URL est une URL valide
  try {
    const url = new URL(process.env.SUPABASE_URL);
    if (!url.protocol.startsWith('http')) {
      console.error('❌ SUPABASE_URL doit commencer par http:// ou https://');
      console.error(`   Valeur actuelle: ${process.env.SUPABASE_URL}`);
      return false;
    }
  } catch (error) {
    console.error('❌ SUPABASE_URL n\'est pas une URL valide');
    console.error(`   Valeur actuelle: ${process.env.SUPABASE_URL}`);
    console.error('   Format attendu: https://xxxxx.supabase.co');
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

