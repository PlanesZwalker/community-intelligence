# 🚀 Déployer le Dashboard sur Vercel - MAINTENANT

Guide rapide pour déployer en 5 minutes.

## ✅ Prérequis

- ✅ Code poussé sur GitHub (déjà fait)
- ✅ Compte Vercel (gratuit)

## 🚀 Étapes de déploiement

### 1. Aller sur Vercel

1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"** (si vous n'avez pas de compte)
3. Connectez-vous avec **GitHub**

### 2. Importer le projet

1. Dans le dashboard Vercel, cliquez sur **"Add New..."** > **"Project"**
2. Sélectionnez votre repo : `PlanesZwalker/community-intelligence`
3. Vercel détectera automatiquement Next.js

### 3. Configuration CRUCIALE ⚠️

**Root Directory** :
- Cliquez sur **"Edit"** à côté de "Root Directory"
- Entrez : `dashboard`
- ⚠️ **C'EST OBLIGATOIRE** - Sinon Vercel cherchera dans la racine et ça ne marchera pas !

**Framework Preset** : Next.js (devrait être auto-détecté)

### 4. Variables d'environnement

Cliquez sur **"Environment Variables"** et ajoutez ces 4 variables :

```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_supabase
NEXT_PUBLIC_DISCORD_CLIENT_ID=votre_client_id_discord
DISCORD_CLIENT_SECRET=votre_client_secret_discord
```

**Où trouver ces valeurs :**
- `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Dans votre projet Supabase > Settings > API
- `NEXT_PUBLIC_DISCORD_CLIENT_ID` : Discord Developer Portal > Votre app > General Information > Application ID
- `DISCORD_CLIENT_SECRET` : Discord Developer Portal > OAuth2 > Client Secret

### 5. Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes
3. Vercel vous donnera une URL (ex: `https://community-intelligence-dashboard.vercel.app`)

### 6. Configurer les Redirects Discord

Une fois déployé, vous aurez une URL Vercel. Configurez les redirects :

#### Dans Discord Developer Portal :
1. Allez sur https://discord.com/developers/applications
2. Votre application > **OAuth2** > **General**
3. Dans **Redirects**, ajoutez :
   - `https://votre-app.vercel.app/dashboard`
   - `https://votre-projet.supabase.co/auth/v1/callback`

#### Dans Supabase :
1. Allez sur votre projet Supabase
2. **Authentication** > **URL Configuration**
3. Dans **Redirect URLs**, ajoutez :
   - `https://votre-app.vercel.app/dashboard`

## ✅ Vérification

1. Allez sur votre URL Vercel
2. Vous devriez voir la page de connexion Discord
3. Cliquez sur "Se connecter avec Discord"
4. Vous devriez être redirigé vers Discord puis vers le dashboard

## 🔧 Problèmes courants

### "404 Not Found" après connexion
- Vérifiez que les Redirect URLs sont bien configurées dans Discord et Supabase

### Erreur de build
- Vérifiez que le Root Directory est bien `dashboard`
- Vérifiez les logs de build dans Vercel

### "Invalid redirect URI"
- Vérifiez que l'URL dans Discord Redirects correspond exactement à votre URL Vercel

## 📚 Documentation complète

Voir `dashboard/VERCEL_DEPLOY.md` pour plus de détails.

---

**Votre dashboard sera en ligne en quelques minutes ! 🎉**

