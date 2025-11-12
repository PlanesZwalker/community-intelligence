# 💳 Configuration Stripe - Guide Complet

Votre compte Stripe : https://dashboard.stripe.com/acct_1SSfo78u9vlXWPnz/test/dashboard

## 🚀 Configuration Rapide (5 étapes)

### Étape 1 : Récupérer les Clés API Stripe

1. Allez sur votre [Stripe Dashboard](https://dashboard.stripe.com/acct_1SSfo78u9vlXWPnz/test/dashboard)
2. Cliquez sur **"Developers"** dans le menu de gauche
3. Cliquez sur **"API keys"**
4. **Copiez la Secret key** (commence par `sk_test_...`)
   - Cliquez sur "Reveal test key" si nécessaire
   - ⚠️ **Gardez cette clé secrète !**

### Étape 2 : Créer le Webhook Stripe

1. Dans Stripe Dashboard, allez dans **"Developers"** > **"Webhooks"**
2. Cliquez sur **"Add endpoint"**
3. **Endpoint URL** : 
   ```
   https://community-intelligence.onrender.com/webhook/stripe
   ```
   ⚠️ Remplacez par l'URL de votre bot sur Render si différente
4. **Description** : `Community Intelligence Bot - Payment Webhooks`
5. **Events to send** : Sélectionnez ces événements :
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
6. Cliquez sur **"Add endpoint"**
7. **Copiez le Signing secret** (commence par `whsec_...`)
   - Cliquez sur "Reveal" dans la section "Signing secret"
   - ⚠️ **Vous en aurez besoin pour la variable d'environnement**

### Étape 3 : Créer la Table dans Supabase

1. Allez sur https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh
2. Cliquez sur **"SQL Editor"** > **"New query"**
3. Copiez-collez le contenu de `supabase/schema_stripe.sql`
4. Cliquez sur **"Run"** (ou `Ctrl+Enter`)
5. Vérifiez que la table `guild_subscriptions` apparaît dans **"Table Editor"**

### Étape 4 : Ajouter les Variables d'Environnement dans Render

1. Allez sur https://dashboard.render.com
2. Sélectionnez votre service **community-intelligence**
3. Allez dans **"Environment"**
4. Ajoutez ces **3 variables** :

```env
STRIPE_SECRET_KEY=sk_test_... (votre Secret key de test)
STRIPE_WEBHOOK_SECRET=whsec_... (votre Signing secret du webhook)
BOT_URL=https://community-intelligence.onrender.com (URL de votre bot)
```

**⚠️ Important** :
- Utilisez les clés **TEST** pour l'instant (`sk_test_...`)
- Le `BOT_URL` doit être l'URL publique de votre bot sur Render
- Le `STRIPE_WEBHOOK_SECRET` vient de l'étape 2.7

5. Cliquez sur **"Save Changes"**
6. Le bot redémarrera automatiquement

### Étape 5 : Tester les Paiements

#### Carte de Test Stripe

Utilisez cette carte pour tester sans payer réellement :

- **Numéro** : `4242 4242 4242 4242`
- **Date d'expiration** : N'importe quelle date future (ex: `12/34`)
- **CVC** : N'importe quel 3 chiffres (ex: `123`)
- **Code postal** : N'importe quel code postal (ex: `12345`)

#### Test dans Discord

1. Utilisez la commande `/ci-upgrade pro` dans Discord
2. Cliquez sur le lien de paiement
3. Utilisez la carte de test `4242 4242 4242 4242`
4. Complétez le paiement
5. Vérifiez que l'abonnement est activé avec `/ci-plan`

## ✅ Checklist de Vérification

- [ ] Clés API Stripe récupérées (test)
- [ ] Webhook créé avec les bons événements
- [ ] Signing secret du webhook copié
- [ ] Table `guild_subscriptions` créée dans Supabase
- [ ] Variables d'environnement ajoutées dans Render
- [ ] Bot redéployé avec les nouvelles variables
- [ ] Test de paiement réussi avec carte de test
- [ ] Abonnement visible dans Stripe Dashboard
- [ ] Abonnement enregistré dans Supabase
- [ ] Commande `/ci-plan` affiche le bon plan

## 🔍 Vérification Post-Configuration

### Dans Stripe Dashboard

1. **Payments** : Vous devriez voir le paiement de test
2. **Customers** : Vous devriez voir le customer créé
3. **Subscriptions** : Vous devriez voir l'abonnement actif
4. **Webhooks** : Vous devriez voir les événements reçus (statut 200)

### Dans Supabase

1. Allez dans **"Table Editor"** > **"guild_subscriptions"**
2. Vous devriez voir une entrée avec :
   - `plan_type` : `pro`
   - `status` : `active`
   - `stripe_customer_id` : L'ID du customer Stripe
   - `stripe_subscription_id` : L'ID de l'abonnement Stripe

### Dans Discord

1. `/ci-plan` : Affiche le plan actuel (devrait être "Pro")
2. `/ci-billing` : Ouvre le portail de facturation Stripe

## 🐛 Dépannage

### Le webhook ne fonctionne pas

1. Vérifiez que l'URL du webhook est correcte dans Stripe
2. Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct dans Render
3. Vérifiez les logs Render pour voir les erreurs
4. Vérifiez les logs Stripe Dashboard > Webhooks pour voir les tentatives

### Les paiements ne sont pas enregistrés

1. Vérifiez que la table `guild_subscriptions` existe dans Supabase
2. Vérifiez que `STRIPE_SECRET_KEY` est configurée dans Render
3. Vérifiez les logs du bot pour les erreurs
4. Vérifiez que le webhook reçoit bien les événements dans Stripe Dashboard

### Le lien de paiement ne fonctionne pas

1. Vérifiez que `BOT_URL` est configuré correctement
2. Vérifiez que l'URL est accessible publiquement
3. Vérifiez les logs pour les erreurs de création de session

### Erreur "STRIPE_SECRET_KEY non configurée"

1. Vérifiez que la variable est bien ajoutée dans Render
2. Vérifiez qu'elle commence par `sk_test_...` ou `sk_live_...`
3. Redéployez le bot après avoir ajouté la variable

## 📊 Monitoring

### Logs à Surveiller dans Render

Vous devriez voir ces messages dans les logs :

- `✅ Abonnement activé: [guild_id] - Plan [plan_type]` après un paiement réussi
- `🔄 Abonnement mis à jour: [guild_id] - Status: [status]` lors des mises à jour
- `❌ Abonnement annulé: [customer_id]` lors des annulations

### Dashboard Stripe

Surveillez régulièrement :
- **Payments** : Tous les paiements (réussis et échoués)
- **Subscriptions** : Tous les abonnements actifs
- **Webhooks** : Les événements reçus et leur statut
- **Customers** : Tous les clients créés

## 🚀 Passage en Production

Quand vous êtes prêt pour les vrais paiements :

1. **Activez votre compte Stripe** (vérification d'identité requise)
2. **Basculez en mode Live** dans Stripe Dashboard (toggle en haut à droite)
3. **Récupérez les clés Live** (`pk_live_...` et `sk_live_...`)
4. **Créez un nouveau webhook Live** avec l'URL de production
5. **Mettez à jour les variables dans Render** avec les clés Live
6. **Testez avec une vraie carte** (petit montant)

## 💰 Prix Configurés

Les prix actuels sont :
- **Pro** : 25€/mois
- **Business** : 75€/mois
- **Enterprise** : 250€/mois

Pour modifier les prix, éditez `src/utils/stripe.js` dans la fonction `createCheckoutSession`.

---

**Votre système de paiement Stripe est maintenant configuré ! 🎉**

Pour toute question, consultez la documentation Stripe : https://stripe.com/docs

