# 💳 Guide d'Installation - Intégration Stripe

Ce guide explique comment configurer Stripe pour activer les paiements dans Community Intelligence.

## 📋 Prérequis

1. Compte Stripe (gratuit) : https://stripe.com
2. Bot Discord déployé et fonctionnel
3. Accès à Supabase pour créer les tables

## 🚀 Installation

### Étape 1 : Créer un compte Stripe

1. Allez sur https://stripe.com
2. Créez un compte (gratuit)
3. Activez votre compte (vérification d'identité requise pour recevoir des paiements)

### Étape 2 : Récupérer les clés API Stripe

1. Allez dans le **Dashboard Stripe** : https://dashboard.stripe.com
2. Cliquez sur **Developers** > **API keys**
3. Copiez la **Secret key** (commence par `sk_`)
4. Copiez la **Publishable key** (commence par `pk_`) - optionnel pour le dashboard

### Étape 3 : Configurer le Webhook Stripe

1. Dans Stripe Dashboard, allez dans **Developers** > **Webhooks**
2. Cliquez sur **Add endpoint**
3. **Endpoint URL** : `https://votre-bot-url.onrender.com/webhook/stripe`
   - Remplacez `votre-bot-url.onrender.com` par l'URL de votre bot sur Render
4. **Events to send** : Sélectionnez ces événements :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Cliquez sur **Add endpoint**
6. **Copiez le Signing secret** (commence par `whsec_`) - vous en aurez besoin !

### Étape 4 : Créer la table dans Supabase

1. Allez sur https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh
2. Cliquez sur **SQL Editor** > **New query**
3. Copiez-collez le contenu de `supabase/schema_stripe.sql`
4. Cliquez sur **Run**

### Étape 5 : Ajouter les variables d'environnement

Dans **Render** (ou votre plateforme de déploiement), ajoutez ces variables :

```env
STRIPE_SECRET_KEY=sk_test_... (votre clé secrète Stripe)
STRIPE_WEBHOOK_SECRET=whsec_... (votre signing secret du webhook)
BOT_URL=https://votre-bot-url.onrender.com (URL publique de votre bot)
```

**⚠️ Important** :
- En développement, utilisez les clés **test** (commencent par `sk_test_` et `pk_test_`)
- En production, utilisez les clés **live** (commencent par `sk_live_` et `pk_live_`)
- Le `BOT_URL` doit être l'URL publique de votre bot (pour les redirects après paiement)

### Étape 6 : Installer le package Stripe

Le package Stripe sera installé automatiquement lors du déploiement. Si vous testez localement :

```bash
npm install stripe
```

## 🧪 Test en Mode Test

Stripe fournit des cartes de test pour tester les paiements :

- **Carte valide** : `4242 4242 4242 4242`
- **Date d'expiration** : N'importe quelle date future (ex: `12/34`)
- **CVC** : N'importe quel 3 chiffres (ex: `123`)
- **Code postal** : N'importe quel code postal (ex: `12345`)

### Tester un paiement

1. Utilisez `/ci-upgrade pro` dans Discord
2. Cliquez sur le lien de paiement
3. Utilisez la carte de test `4242 4242 4242 4242`
4. Vérifiez que l'abonnement est activé avec `/ci-plan`

## 📊 Vérification

### Vérifier que tout fonctionne

1. **Webhook** : Vérifiez les logs Stripe Dashboard > Webhooks pour voir les événements reçus
2. **Abonnement** : Utilisez `/ci-plan` pour voir le plan actuel
3. **Billing** : Utilisez `/ci-billing` pour accéder au portail de facturation

### Logs à surveiller

Dans les logs Render, vous devriez voir :
- `✅ Abonnement activé: [guild_id] - Plan [plan_type]` après un paiement réussi
- `🔄 Abonnement mis à jour: [guild_id] - Status: [status]` lors des mises à jour
- `❌ Abonnement annulé: [customer_id]` lors des annulations

## 🔧 Dépannage

### Le webhook ne fonctionne pas

1. Vérifiez que l'URL du webhook est correcte dans Stripe
2. Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct dans Render
3. Vérifiez les logs Stripe Dashboard > Webhooks pour voir les erreurs

### Les paiements ne sont pas enregistrés

1. Vérifiez que la table `guild_subscriptions` existe dans Supabase
2. Vérifiez que `STRIPE_SECRET_KEY` est configurée
3. Vérifiez les logs du bot pour les erreurs

### Le lien de paiement ne fonctionne pas

1. Vérifiez que `BOT_URL` est configuré correctement
2. Vérifiez que l'URL est accessible publiquement
3. Vérifiez les logs pour les erreurs de création de session

## 💰 Pricing

Les prix configurés sont :
- **Pro** : 25€/mois
- **Business** : 75€/mois
- **Enterprise** : 250€/mois

Pour modifier les prix, éditez `src/utils/stripe.js` dans la fonction `createCheckoutSession`.

## 🎯 Prochaines Étapes

1. Tester les paiements en mode test
2. Passer en mode production (clés live)
3. Configurer les emails de facturation dans Stripe
4. Ajouter des limites premium dans les commandes

---

**Besoin d'aide ?** Consultez la documentation Stripe : https://stripe.com/docs

