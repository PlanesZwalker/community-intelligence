# 💳 Configuration Stripe - Guide Final

## ✅ Clés Stripe

Vous avez récupéré vos clés Stripe. **Gardez-les dans vos notes personnelles** (pas dans le repo Git).

- **Publishable Key** : `pk_test_...` (commence par pk_test_)
- **Secret Key** : `sk_test_...` (commence par sk_test_)

## 🚀 Configuration en 3 Étapes

### Étape 1 : Créer le Webhook Stripe ⚠️ IMPORTANT

1. Allez sur https://dashboard.stripe.com/acct_1SSfo78u9vlXWPnz/test/webhooks
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
   - Cliquez sur le webhook créé
   - Dans "Signing secret", cliquez sur "Reveal"
   - ⚠️ **Copiez cette valeur - vous en aurez besoin !**

### Étape 2 : Créer la Table dans Supabase

1. Allez sur https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh
2. Cliquez sur **"SQL Editor"** > **"New query"**
3. Copiez-collez le contenu de `supabase/schema_stripe.sql`
4. Cliquez sur **"Run"** (ou `Ctrl+Enter`)
5. Vérifiez que la table `guild_subscriptions` apparaît dans **"Table Editor"**

### Étape 3 : Ajouter les Variables d'Environnement dans Render

1. Allez sur https://dashboard.render.com
2. Sélectionnez votre service **community-intelligence**
3. Allez dans **"Environment"**
4. Ajoutez ces **3 variables** :

```env
STRIPE_SECRET_KEY=votre_secret_key_sk_test_...
STRIPE_WEBHOOK_SECRET=votre_signing_secret_whsec_...
BOT_URL=https://community-intelligence.onrender.com
```

**⚠️ Important** :
- Remplacez `votre_secret_key_sk_test_...` par votre Secret Key Stripe
- Remplacez `votre_signing_secret_whsec_...` par le Signing secret du webhook (étape 1.7)
- Le `BOT_URL` doit être l'URL publique de votre bot sur Render
- Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs

5. Cliquez sur **"Save Changes"**
6. Le bot redémarrera automatiquement

## ✅ Checklist Finale

- [x] Secret Key récupérée (gardée dans vos notes personnelles)
- [ ] Webhook créé avec les bons événements
- [ ] Signing secret du webhook copié
- [ ] Table `guild_subscriptions` créée dans Supabase
- [ ] Variables d'environnement ajoutées dans Render
- [ ] Bot redéployé
- [ ] Test de paiement réussi

## 🧪 Tester les Paiements

Une fois les 3 étapes complétées :

1. Utilisez `/ci-upgrade pro` dans Discord
2. Cliquez sur le lien de paiement
3. Utilisez la carte de test : `4242 4242 4242 4242`
   - Date : `12/34`
   - CVC : `123`
   - Code postal : `12345`
4. Complétez le paiement
5. Vérifiez avec `/ci-plan` que le plan est "Pro"

## 🔍 Vérification

### Dans Stripe Dashboard
- **Payments** : Vous devriez voir le paiement de test
- **Subscriptions** : Vous devriez voir l'abonnement actif
- **Webhooks** : Vous devriez voir les événements reçus (statut 200)

### Dans Supabase
- **Table Editor** > **guild_subscriptions** : Entrée avec `plan_type: pro`

### Dans Discord
- `/ci-plan` : Affiche le plan actuel
- `/ci-billing` : Ouvre le portail de facturation

---

**Une fois ces 3 étapes complétées, votre système de paiement sera opérationnel ! 🎉**

