# Configuration des Variables d'Environnement Vercel

Guide pour configurer les variables d'environnement nécessaires pour le dashboard Community Intelligence sur Vercel.

## 📋 Variables Requises

### 1. Supabase (Requis)

Ces variables sont **obligatoires** pour que le dashboard fonctionne.

#### `NEXT_PUBLIC_SUPABASE_URL`
- **Description** : URL de votre projet Supabase
- **Où trouver** : Supabase Dashboard > Settings > API > Project URL
- **Format** : `https://xxxxx.supabase.co`
- **Exemple** : `https://twpznfiyatzuwkyfgudh.supabase.co`

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Description** : Clé publique anonyme Supabase
- **Où trouver** : Supabase Dashboard > Settings > API > anon public key
- **Format** : Longue chaîne de caractères commençant par `eyJ...`
- **Note** : Cette clé est publique et peut être exposée côté client

### 2. Supabase Service Role Key (Recommandé)

#### `SUPABASE_SERVICE_ROLE_KEY`
- **Description** : Clé de service Supabase pour les opérations admin
- **Où trouver** : Supabase Dashboard > Settings > API > service_role key
- **Format** : Longue chaîne de caractères commençant par `eyJ...`
- **⚠️ Important** : Cette clé est **SECRÈTE** et ne doit jamais être exposée côté client
- **Utilisation** : Utilisée dans les API routes pour les opérations admin (billing, subscriptions)
- **Fallback** : Si non définie, utilise `NEXT_PUBLIC_SUPABASE_ANON_KEY` (moins sécurisé)

### 3. Stripe (Requis pour fonctionnalités premium)

#### `STRIPE_SECRET_KEY`
- **Description** : Clé secrète Stripe pour les paiements
- **Où trouver** : 
  - **Test** : Stripe Dashboard > Developers > API keys > Secret key (test)
  - **Production** : Stripe Dashboard > Developers > API keys > Secret key (live)
- **Format** : Commence par `sk_test_` (test) ou `sk_live_` (production)
- **Exemple test** : `sk_test_51SSfo78u9vlXWPnz...`
- **⚠️ Important** : Cette clé est **SECRÈTE** et ne doit jamais être exposée côté client

### 4. Site URL (Optionnel)

#### `NEXT_PUBLIC_SITE_URL`
- **Description** : URL de votre site déployé sur Vercel
- **Format** : `https://votre-site.vercel.app` ou votre domaine custom
- **Note** : Vercel détecte automatiquement cette valeur, mais vous pouvez la définir manuellement
- **Utilisation** : Utilisée pour les URLs de retour Stripe (success_url, cancel_url)

## 🚀 Configuration dans Vercel

### Méthode 1 : Via le Dashboard Vercel (Recommandé)

1. **Allez sur votre projet Vercel** :
   - https://vercel.com/dashboard
   - Sélectionnez votre projet `community-intelligence`

2. **Accédez aux Settings** :
   - Cliquez sur **Settings** dans le menu
   - Cliquez sur **Environment Variables** dans le menu latéral

3. **Ajoutez chaque variable** :
   - Cliquez sur **Add New**
   - Entrez le **Key** (nom de la variable)
   - Entrez la **Value** (valeur de la variable)
   - Sélectionnez les **Environments** :
     - ✅ **Production** (pour production)
     - ✅ **Preview** (pour les previews)
     - ✅ **Development** (pour développement local)
   - Cliquez sur **Save**

4. **Variables à ajouter** :
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = votre_cle_anon_public
   SUPABASE_SERVICE_ROLE_KEY = votre_cle_service_role
   STRIPE_SECRET_KEY = sk_test_votre_cle_secrete
   NEXT_PUBLIC_SITE_URL = https://community-intelligence-chi.vercel.app
   ```

### Méthode 2 : Via Vercel CLI

```bash
# Installer Vercel CLI si nécessaire
npm i -g vercel

# Se connecter
vercel login

# Ajouter les variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add NEXT_PUBLIC_SITE_URL
```

## ✅ Vérification

Après avoir ajouté les variables :

1. **Redéployez votre projet** :
   - Allez dans **Deployments**
   - Cliquez sur les **3 points** du dernier déploiement
   - Cliquez sur **Redeploy**

2. **Vérifiez les logs de build** :
   - Le build devrait réussir sans erreurs
   - Aucune erreur "is not set" ne devrait apparaître

3. **Testez les fonctionnalités** :
   - ✅ Connexion Discord sur `/`
   - ✅ Dashboard sur `/dashboard`
   - ✅ Stripe checkout sur `/landing` (cliquer sur "Essayer Pro")

## 🔒 Sécurité

### Variables Publiques (`NEXT_PUBLIC_*`)
- ✅ Peuvent être exposées côté client
- ✅ Visibles dans le code JavaScript compilé
- ✅ Utilisées pour les appels API côté client

### Variables Secrètes (sans `NEXT_PUBLIC_*`)
- ⚠️ **NE JAMAIS** exposer côté client
- ⚠️ Utilisées uniquement dans les API routes (`/app/api/*`)
- ⚠️ Ne jamais commit dans Git

### Variables à protéger absolument :
- `STRIPE_SECRET_KEY` - Accès complet à votre compte Stripe
- `SUPABASE_SERVICE_ROLE_KEY` - Accès admin à votre base de données

## 🧪 Test vs Production

### Mode Test (Développement)
- Utilisez `sk_test_...` pour `STRIPE_SECRET_KEY`
- Les paiements sont simulés
- Pas de frais réels

### Mode Production
- Utilisez `sk_live_...` pour `STRIPE_SECRET_KEY`
- Les paiements sont réels
- ⚠️ Vérifiez bien avant de passer en production !

## 📝 Checklist

Avant de déployer en production, vérifiez :

- [ ] Toutes les variables sont configurées dans Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_URL` pointe vers le bon projet
- [ ] `STRIPE_SECRET_KEY` utilise la clé de **production** (`sk_live_...`)
- [ ] `NEXT_PUBLIC_SITE_URL` pointe vers votre domaine de production
- [ ] Les webhooks Stripe sont configurés avec la bonne URL
- [ ] Le build réussit sans erreurs
- [ ] Les fonctionnalités sont testées en production

## 🆘 Dépannage

### Erreur "STRIPE_SECRET_KEY is not set"
- ✅ Vérifiez que la variable est bien ajoutée dans Vercel
- ✅ Vérifiez que vous avez redéployé après avoir ajouté la variable
- ✅ Vérifiez que la variable est activée pour l'environnement (Production/Preview)

### Erreur "Supabase credentials are not set"
- ✅ Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` est défini
- ✅ Vérifiez que `NEXT_PUBLIC_SUPABASE_ANON_KEY` est défini
- ✅ Vérifiez que les valeurs sont correctes (copier-coller depuis Supabase)

### Les paiements ne fonctionnent pas
- ✅ Vérifiez que `STRIPE_SECRET_KEY` est correct
- ✅ Vérifiez que vous utilisez la bonne clé (test vs production)
- ✅ Vérifiez les logs Vercel pour les erreurs détaillées

---

**Dernière mise à jour** : {new Date().toLocaleDateString('fr-FR')}

