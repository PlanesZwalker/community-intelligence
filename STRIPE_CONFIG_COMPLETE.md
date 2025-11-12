# 💳 Configuration Stripe - Presque Terminé !

## ✅ Ce qui est déjà fait

- ✅ **Webhook créé** : `we_1SSg2N8u9vlXWPnzijLFcwoF`
- ✅ **URL d'endpoint** : `https://community-intelligence.onrender.com/webhook/stripe`
- ✅ **Signing secret récupéré** : `whsec_e32unPdevM0kclerszXvhTCZvL24bujG`
- ✅ **6 événements configurés**

## 🚀 2 Étapes Restantes

### Étape 1 : Créer la Table dans Supabase

1. Allez sur https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh
2. Cliquez sur **"SQL Editor"** dans le menu de gauche
3. Cliquez sur **"New query"**
4. Copiez-collez ce SQL :

```sql
-- Schéma pour l'intégration Stripe
-- À exécuter dans Supabase SQL Editor si la table n'existe pas déjà

-- Table des abonnements Stripe (alternative à subscriptions)
CREATE TABLE IF NOT EXISTS guild_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    guild_id VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255), -- Utilisateur qui a souscrit
    plan_type VARCHAR(50) NOT NULL DEFAULT 'free', -- free, pro, business, enterprise
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, canceled, past_due, trialing
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guild_subscriptions_guild_id ON guild_subscriptions(guild_id);
CREATE INDEX IF NOT EXISTS idx_guild_subscriptions_stripe_customer ON guild_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_guild_subscriptions_status ON guild_subscriptions(status);
```

5. Cliquez sur **"Run"** (ou `Ctrl+Enter`)
6. Vérifiez que la table `guild_subscriptions` apparaît dans **"Table Editor"**

### Étape 2 : Ajouter les Variables d'Environnement dans Render

1. Allez sur https://dashboard.render.com
2. Sélectionnez votre service **community-intelligence**
3. Allez dans **"Environment"** dans le menu de gauche
4. Cliquez sur **"Add Environment Variable"** pour chaque variable :

#### Variable 1 : STRIPE_SECRET_KEY
- **Key** : `STRIPE_SECRET_KEY`
- **Value** : `sk_test_...` (votre Secret Key Stripe - voir vos notes personnelles)
- Cliquez sur **"Save"**

#### Variable 2 : STRIPE_WEBHOOK_SECRET
- **Key** : `STRIPE_WEBHOOK_SECRET`
- **Value** : `whsec_e32unPdevM0kclerszXvhTCZvL24bujG`
- Cliquez sur **"Save"**

#### Variable 3 : BOT_URL
- **Key** : `BOT_URL`
- **Value** : `https://community-intelligence.onrender.com`
- Cliquez sur **"Save"**

5. Le bot redémarrera automatiquement après chaque ajout de variable

## ✅ Checklist Finale

- [x] Webhook créé dans Stripe
- [x] Signing secret récupéré
- [ ] Table `guild_subscriptions` créée dans Supabase
- [ ] Variable `STRIPE_SECRET_KEY` ajoutée dans Render
- [ ] Variable `STRIPE_WEBHOOK_SECRET` ajoutée dans Render
- [ ] Variable `BOT_URL` ajoutée dans Render
- [ ] Bot redéployé
- [ ] Test de paiement réussi

## 🧪 Tester les Paiements

Une fois les 2 étapes complétées :

1. Attendez que le bot redémarre (1-2 minutes)
2. Utilisez `/ci-upgrade pro` dans Discord
3. Cliquez sur le lien de paiement
4. Utilisez la carte de test : `4242 4242 4242 4242`
   - Date d'expiration : `12/34`
   - CVC : `123`
   - Code postal : `12345`
5. Complétez le paiement
6. Vérifiez avec `/ci-plan` que le plan est "Pro"

## 🔍 Vérification

### Dans Stripe Dashboard
- **Payments** : Vous devriez voir le paiement de test
- **Subscriptions** : Vous devriez voir l'abonnement actif
- **Webhooks** : Vous devriez voir les événements reçus (statut 200)

### Dans Supabase
- **Table Editor** > **guild_subscriptions** : Entrée avec `plan_type: pro` et `status: active`

### Dans Discord
- `/ci-plan` : Affiche le plan actuel (devrait être "Pro")
- `/ci-billing` : Ouvre le portail de facturation Stripe

### Dans les Logs Render
Vous devriez voir ces messages :
- `✅ Abonnement activé: [guild_id] - Plan pro` après un paiement réussi
- `🔄 Abonnement mis à jour: [guild_id] - Status: active` lors des mises à jour

## 🐛 Dépannage

### Le webhook ne fonctionne pas
- Vérifiez que l'URL est correcte : `https://community-intelligence.onrender.com/webhook/stripe`
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct dans Render
- Vérifiez les logs Render pour voir les erreurs
- Vérifiez les logs Stripe Dashboard > Webhooks pour voir les tentatives

### Les paiements ne sont pas enregistrés
- Vérifiez que la table `guild_subscriptions` existe dans Supabase
- Vérifiez que `STRIPE_SECRET_KEY` est configurée dans Render
- Vérifiez les logs du bot pour les erreurs
- Vérifiez que le webhook reçoit bien les événements dans Stripe Dashboard

### Erreur "STRIPE_SECRET_KEY non configurée"
- Vérifiez que la variable est bien ajoutée dans Render
- Vérifiez qu'elle commence par `sk_test_...`
- Redéployez le bot après avoir ajouté la variable

---

**Une fois ces 2 étapes complétées, votre système de paiement sera opérationnel ! 🎉**

