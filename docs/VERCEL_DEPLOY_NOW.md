# 🚀 Déployer le Dashboard sur Vercel - Guide Rapide

## ✅ Étape 1 : Vérifier que le code est sur GitHub

Assurez-vous que votre code est bien poussé sur GitHub :

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## ✅ Étape 2 : Aller sur Vercel

1. Allez sur https://vercel.com
2. Connectez-vous (ou créez un compte gratuit)
3. Cliquez sur **"Sign in with GitHub"** (recommandé)

## ✅ Étape 3 : Importer le projet

1. Dans le dashboard Vercel, cliquez sur **"Add New..."** > **"Project"**
2. Sélectionnez votre repo : `PlanesZwalker/community-intelligence`
3. Vercel détectera automatiquement Next.js

## ✅ Étape 4 : Configuration CRUCIALE ⚠️

### Root Directory

**C'EST LA PARTIE LA PLUS IMPORTANTE** :

1. Cliquez sur **"Edit"** à côté de "Root Directory"
2. Entrez : `dashboard`
3. ⚠️ **SANS le point ni le slash** - juste `dashboard`

### Framework Preset

- **Next.js** (devrait être auto-détecté)

### Build Settings

- **Build Command** : `npm run build` (automatique)
- **Output Directory** : `.next` (automatique)
- **Install Command** : `npm install` (automatique)

## ✅ Étape 5 : Variables d'environnement

Cliquez sur **"Environment Variables"** et ajoutez **UNE PAR UNE** :

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://twpznfiyatzuwkyfgudh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `votre_cle_anon_public` (de votre .env.local) |
| `NEXT_PUBLIC_DISCORD_CLIENT_ID` | `1437809276927213628` |
| `DISCORD_CLIENT_SECRET` | `votre_client_secret_discord` (de votre .env.local) |

⚠️ **IMPORTANT** :
- Copiez-collez **EXACTEMENT** les valeurs de votre `.env.local`
- Vérifiez qu'il n'y a **PAS d'espaces** avant/après
- Cliquez sur **"Add"** après chaque variable

**Note** : `NEXTAUTH_URL` sera automatiquement défini par Vercel, vous n'avez pas besoin de l'ajouter.

## ✅ Étape 6 : Déployer

1. Cliquez sur **"Deploy"** (en bas à droite)
2. Attendez 2-3 minutes
3. Vercel va :
   - Installer les dépendances
   - Builder le projet
   - Déployer

## ✅ Étape 7 : Récupérer l'URL

Une fois le déploiement terminé, Vercel vous donnera une URL :
- Exemple : `https://community-intelligence.vercel.app`
- Ou : `https://community-intelligence-xxxxx.vercel.app`

**Copiez cette URL** - vous en aurez besoin pour la prochaine étape !

## ✅ Étape 8 : Configurer les Redirects

### Dans Discord Developer Portal :

1. Allez sur https://discord.com/developers/applications
2. Sélectionnez votre application
3. **OAuth2** > **General**
4. Dans **Redirects**, ajoutez :
   - `https://votre-app.vercel.app/dashboard` (remplacez par votre URL Vercel)
   - `https://twpznfiyatzuwkyfgudh.supabase.co/auth/v1/callback`
5. Cliquez sur **"Save Changes"**

### Dans Supabase :

1. Allez sur https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh
2. **Authentication** > **URL Configuration**
3. Dans **Redirect URLs**, ajoutez :
   - `https://votre-app.vercel.app/dashboard` (remplacez par votre URL Vercel)
4. Cliquez sur **"Save"**

## ✅ Étape 9 : Tester

1. Allez sur votre URL Vercel (ex: `https://community-intelligence.vercel.app`)
2. Vous devriez voir la page de connexion Discord
3. Cliquez sur **"Se connecter avec Discord"**
4. Vous serez redirigé vers Discord pour autoriser
5. Après autorisation, vous serez redirigé vers `/dashboard`
6. Les statistiques devraient s'afficher !

## ❌ Problèmes courants

### "404 Not Found" après connexion

**Solution** :
- Vérifiez que les Redirect URLs sont bien configurées dans Discord et Supabase
- Format : `https://votre-app.vercel.app/dashboard`

### "Invalid redirect URI"

**Solution** :
- Vérifiez que l'URL dans Discord Redirects correspond exactement à votre URL Vercel
- Vérifiez qu'il n'y a pas d'espaces ou de caractères invisibles

### Erreur de build

**Solution** :
- Vérifiez que le Root Directory est bien `dashboard` (sans point ni slash)
- Vérifiez les logs de build dans Vercel pour voir l'erreur exacte

### Variables d'environnement non trouvées

**Solution** :
- Vérifiez que toutes les variables sont bien ajoutées dans Vercel
- Vérifiez qu'elles commencent par `NEXT_PUBLIC_` pour les variables publiques
- Redéployez après avoir ajouté les variables

## 🔄 Mises à jour futures

Pour mettre à jour le dashboard :

```bash
git add .
git commit -m "Description des changements"
git push origin main
```

Vercel redéploiera automatiquement ! 🚀

---

**Votre dashboard sera en ligne en quelques minutes ! 🎉**

