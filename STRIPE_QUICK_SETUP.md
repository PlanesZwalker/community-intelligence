# 💳 Configuration Stripe - Guide Rapide

## ✅ Clés Stripe Récupérées

**Publishable Key (clé publique)** :
```
pk_test_51SSfo78u9vlXWPnzmCdvWaeVCT8SjX6t19gpT8v32EtAYXbBoCrau09zj89mnb99K8bSYOAxW1OogV20j3aEYAW600icPLPTzX
```
✅ Cette clé est pour le frontend (dashboard) - optionnel pour l'instant

**Secret Key (clé secrète)** : ⚠️ **À RÉCUPÉRER**
- Allez sur https://dashboard.stripe.com/acct_1SSfo78u9vlXWPnz/test/apikeys
- Cliquez sur **"Reveal test key"** à côté de "Secret key"
- Copiez la clé qui commence par `sk_test_...`
- ⚠️ **Cette clé est nécessaire pour le bot !**

## 🚀 Configuration en 4 Étapes

### Étape 1 : Créer le Webhook Stripe

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
   - ⚠️ **Copiez cette valeur !**

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
STRIPE_SECRET_KEY=sk_test_... (votre Secret key - à récupérer)
STRIPE_WEBHOOK_SECRET=whsec_... (votre Signing secret du webhook - étape 1.7)
BOT_URL=https://community-intelligence.onrender.com (URL de votre bot)
```

**⚠️ Important** :
- Utilisez les clés **TEST** pour l'instant
- Le `BOT_URL` doit être l'URL publique de votre bot sur Render
- Les valeurs doivent être exactes (pas d'espaces)

5. Cliquez sur **"Save Changes"**
6. Le bot redémarrera automatiquement

### Étape 4 : Tester les Paiements

#### Carte de Test Stripe

- **Numéro** : `4242 4242 4242 4242`
- **Date d'expiration** : `12/34` (ou toute date future)
- **CVC** : `123` (ou n'importe quel 3 chiffres)
- **Code postal** : `12345` (ou n'importe quel code postal)

#### Test dans Discord

1. Utilisez `/ci-upgrade pro` dans Discord
2. Cliquez sur le lien de paiement
3. Utilisez la carte de test `4242 4242 4242 4242`
4. Complétez le paiement
5. Vérifiez avec `/ci-plan` que le plan est "Pro"

## ✅ Checklist

- [ ] Secret Key récupérée (`sk_test_...`)
- [ ] Webhook créé avec les bons événements
- [ ] Signing secret du webhook copié (`whsec_...`)
- [ ] Table `guild_subscriptions` créée dans Supabase
- [ ] Variables d'environnement ajoutées dans Render
- [ ] Bot redéployé
- [ ] Test de paiement réussi

## 🔍 Vérification

### Dans Stripe Dashboard

1. **Payments** : Vous devriez voir le paiement de test
2. **Customers** : Vous devriez voir le customer créé
3. **Subscriptions** : Vous devriez voir l'abonnement actif
4. **Webhooks** : Vous devriez voir les événements reçus (statut 200)

### Dans Supabase

1. Allez dans **"Table Editor"** > **"guild_subscriptions"**
2. Vous devriez voir une entrée avec `plan_type: pro` et `status: active`

### Dans Discord

- `/ci-plan` : Affiche le plan actuel
- `/ci-billing` : Ouvre le portail de facturation

## 🐛 Dépannage

### "STRIPE_SECRET_KEY non configurée"
- Vérifiez que la variable est bien ajoutée dans Render
- Vérifiez qu'elle commence par `sk_test_...`
- Redéployez le bot

### Le webhook ne fonctionne pas
- Vérifiez que l'URL est correcte : `https://community-intelligence.onrender.com/webhook/stripe`
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct
- Vérifiez les logs Stripe Dashboard > Webhooks

### Les paiements ne sont pas enregistrés
- Vérifiez que la table `guild_subscriptions` existe dans Supabase
- Vérifiez les logs Render pour les erreurs
- Vérifiez que le webhook reçoit bien les événements

---

**Une fois ces 4 étapes complétées, votre système de paiement sera opérationnel ! 🎉**

