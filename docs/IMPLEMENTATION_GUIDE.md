# 🚀 Guide d'Implémentation - Système de Monétisation

## 📋 Étapes pour Activer la Monétisation

### 1. Créer les Tables de Base de Données

Exécutez le fichier `supabase/schema_premium.sql` dans votre éditeur SQL Supabase :

1. Allez sur https://supabase.com/dashboard/project/[votre-projet]/sql
2. Cliquez sur "New query"
3. Copiez-collez le contenu de `supabase/schema_premium.sql`
4. Cliquez sur "Run" (ou `Ctrl+Enter`)
5. Vérifiez que toutes les tables sont créées dans "Table Editor"

### 2. Configurer Stripe (Optionnel - pour les paiements)

Si vous voulez intégrer Stripe pour les paiements :

1. Créez un compte sur https://stripe.com
2. Récupérez vos clés API (Test et Production)
3. Ajoutez les variables d'environnement dans Render :
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### 3. Ajouter les Commandes Discord

Les nouvelles commandes seront :
- `/ci-plan` - Affiche le plan actuel et l'utilisation
- `/ci-upgrade` - Affiche les options d'upgrade
- `/ci-features` - Liste les fonctionnalités disponibles

### 4. Modifier les Commandes Existantes

Ajoutez des vérifications de limites dans :
- `/ci-ai-summary` - Vérifier `hasFeature('ai')`
- `/ci-sync-history` - Vérifier `checkLimit('channels')`
- Message handler - Vérifier `checkLimit('messages')`

### 5. Créer une Page de Pricing

Créez une page web pour les abonnements :
- `/pricing` dans le dashboard
- Intégration Stripe Checkout
- Gestion des webhooks Stripe

## 🔧 Modifications à Apporter

### Dans `src/handlers/commandHandler.js`

Ajoutez les nouvelles commandes :
```javascript
{
  name: 'ci-plan',
  description: 'Affiche votre plan actuel et l\'utilisation',
  execute: async (interaction, client) => {
    const stats = await getUsageStats(interaction.guild.id, client.supabase);
    // Afficher les stats...
  },
},
{
  name: 'ci-upgrade',
  description: 'Affiche les options d\'upgrade disponibles',
  execute: async (interaction, client) => {
    // Afficher les plans et lien vers checkout...
  },
},
```

### Dans `src/handlers/messageHandler.js`

Ajoutez la vérification de limite :
```javascript
import { checkLimit, incrementUsage } from '../utils/premium.js';

// Avant d'insérer le message
const limitCheck = await checkLimit(message.guild.id, 'messages', supabase);
if (!limitCheck.available) {
  // Ne pas insérer, mais ne pas bloquer non plus (silencieux)
  return;
}

// Après insertion réussie
await incrementUsage(message.guild.id, 'messages', 1, supabase);
```

### Dans `src/utils/weeklySummary.js`

Ajoutez la vérification pour l'IA :
```javascript
import { hasFeature } from '../utils/premium.js';

if (useAI && process.env.GROQ_API_KEY) {
  const hasAI = await hasFeature(guildId, 'ai', supabase);
  if (!hasAI) {
    console.log('⚠️ IA non disponible pour ce plan');
    return; // Ne pas générer de résumé IA
  }
  // ...
}
```

## 📊 Dashboard Web

Ajoutez une section "Premium" dans le dashboard :
- Affichage du plan actuel
- Statistiques d'utilisation
- Bouton d'upgrade
- Historique des factures (si Stripe intégré)

## 🧪 Tests

Avant de déployer en production :

1. **Test du plan gratuit** :
   - Vérifier que les limites fonctionnent
   - Vérifier que les fonctionnalités premium sont bloquées

2. **Test du plan Pro** :
   - Créer un abonnement test dans Stripe
   - Vérifier que toutes les fonctionnalités sont débloquées

3. **Test des limites** :
   - Atteindre les limites du plan gratuit
   - Vérifier les messages d'erreur appropriés

## 🚨 Points d'Attention

1. **Migration des données existantes** :
   - Les serveurs existants doivent être initialisés avec le plan gratuit
   - Compter les messages existants pour les limites

2. **Performance** :
   - Les vérifications de limites ajoutent des requêtes DB
   - Utiliser des caches si nécessaire

3. **Expérience utilisateur** :
   - Ne pas bloquer brutalement les fonctionnalités
   - Afficher des messages clairs sur les limites
   - Proposer des alternatives (upgrade, etc.)

4. **Sécurité** :
   - Ne jamais faire confiance aux données client
   - Toujours vérifier les limites côté serveur
   - Valider les webhooks Stripe avec la signature

## 📈 Métriques à Suivre

- Nombre de serveurs par plan
- Taux de conversion Free → Pro
- Taux de rétention
- Utilisation moyenne des limites
- Revenus mensuels récurrents (MRR)

## 🎯 Prochaines Étapes

1. Implémenter les commandes de base (`/ci-plan`, `/ci-upgrade`)
2. Ajouter les vérifications de limites dans les commandes existantes
3. Créer la page de pricing dans le dashboard
4. Intégrer Stripe (optionnel)
5. Ajouter les rapports automatiques (fonctionnalité Pro)
6. Ajouter l'export de données (fonctionnalité Pro)
7. Créer l'API REST (fonctionnalité Enterprise)

