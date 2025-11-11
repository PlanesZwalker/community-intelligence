# 🚀 Guide de Déploiement

Guide complet pour déployer le bot sur Render.com et le dashboard sur Vercel.

## 📋 Prérequis

- Compte GitHub (gratuit)
- Compte Render.com (gratuit)
- Compte Vercel (gratuit)
- Compte Supabase (gratuit)
- Compte Discord Developer (gratuit)

## 🔧 Étape 1 : Préparer le dépôt Git

### 1.1 Initialiser Git (si pas déjà fait)

```bash
git init
git add .
git commit -m "Initial commit: Community Intelligence Bot + Dashboard"
```

### 1.2 Créer un dépôt sur GitHub

1. Allez sur https://github.com/new
2. Créez un nouveau dépôt (ex: `community-intelligence`)
3. **Ne cochez PAS** "Initialize with README" (on a déjà un README)
4. Copiez l'URL du dépôt (ex: `https://github.com/votre-username/community-intelligence.git`)

### 1.3 Pousser le code

```bash
git remote add origin https://github.com/votre-username/community-intelligence.git
git branch -M main
git push -u origin main
```

## 🤖 Étape 2 : Déployer le Bot sur Render.com

### 2.1 Créer un compte Render

1. Allez sur https://render.com
2. Créez un compte (gratuit)
3. Connectez votre compte GitHub

### 2.2 Créer un nouveau service

1. Dans le dashboard Render, cliquez sur **"New +"** > **"Web Service"**
2. Connectez votre dépôt GitHub
3. Sélectionnez votre dépôt `community-intelligence`

### 2.3 Configuration du service

- **Name** : `community-intelligence-bot`
- **Environment** : `Node`
- **Region** : Choisissez la plus proche (ex: `Frankfurt`)
- **Branch** : `main`
- **Root Directory** : `.` (racine)
- **Build Command** : `npm install`
- **Start Command** : `npm start`
- **Plan** : `Free` (gratuit)

### 2.4 Variables d'environnement

Dans la section **"Environment Variables"**, ajoutez :

```
DISCORD_TOKEN=votre_token_discord
DISCORD_CLIENT_ID=votre_client_id
SUPABASE_URL=votre_url_supabase
SUPABASE_KEY=votre_cle_supabase
NODE_ENV=production
AI_PROVIDER=groq
GROQ_API_KEY=votre_cle_groq (optionnel)
```

**Important** : Cliquez sur **"Save Changes"** après avoir ajouté toutes les variables.

### 2.5 Déployer

1. Cliquez sur **"Create Web Service"**
2. Render va automatiquement :
   - Cloner votre repo
   - Installer les dépendances
   - Démarrer le bot
3. Attendez que le statut passe à **"Live"** (vert)

### 2.6 Vérifier le déploiement

- Les logs sont visibles dans l'onglet **"Logs"**
- Vous devriez voir : `✅ Bot connecté en tant que [VotreBot]`
- Testez les commandes sur votre serveur Discord : `/stats`

## 📊 Étape 3 : Déployer le Dashboard sur Vercel

### 3.1 Créer un compte Vercel

1. Allez sur https://vercel.com
2. Créez un compte (gratuit)
3. Connectez votre compte GitHub

### 3.2 Importer le projet

1. Dans le dashboard Vercel, cliquez sur **"Add New..."** > **"Project"**
2. Importez votre dépôt GitHub `community-intelligence`
3. Vercel détectera automatiquement Next.js

### 3.3 Configuration du projet

- **Framework Preset** : `Next.js` (détecté automatiquement)
- **Root Directory** : `./dashboard` ⚠️ **IMPORTANT**
- **Build Command** : `npm run build` (automatique)
- **Output Directory** : `.next` (automatique)
- **Install Command** : `npm install` (automatique)

### 3.4 Variables d'environnement

Dans **"Environment Variables"**, ajoutez :

```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_supabase
NEXT_PUBLIC_DISCORD_CLIENT_ID=votre_client_id
DISCORD_CLIENT_SECRET=votre_client_secret
NEXTAUTH_URL=https://votre-app.vercel.app
```

**Note** : `NEXTAUTH_URL` sera automatiquement défini par Vercel, mais vous pouvez le laisser vide pour l'instant.

### 3.5 Déployer

1. Cliquez sur **"Deploy"**
2. Vercel va automatiquement :
   - Installer les dépendances
   - Builder le projet
   - Déployer
3. Attendez que le déploiement soit terminé (2-3 minutes)

### 3.6 Configurer l'URL de production

1. Une fois déployé, Vercel vous donnera une URL (ex: `https://community-intelligence.vercel.app`)
2. Retournez dans **Settings** > **Environment Variables**
3. Mettez à jour `NEXTAUTH_URL` avec votre URL Vercel
4. Redéployez (Vercel le fait automatiquement)

### 3.7 Configurer Supabase Auth

Voir `dashboard/SUPABASE_AUTH_SETUP.md` pour configurer l'authentification Discord.

## ✅ Vérification finale

### Bot Discord
- ✅ Le bot répond aux commandes `/stats` et `/weekly-summary`
- ✅ Les messages sont collectés dans Supabase
- ✅ Les logs Render montrent "Bot connecté"

### Dashboard
- ✅ Vous pouvez vous connecter avec Discord
- ✅ Le dashboard affiche les statistiques
- ✅ Les graphiques fonctionnent

## 🔄 Mises à jour futures

### Mettre à jour le bot

```bash
git add .
git commit -m "Description des changements"
git push origin main
```

Render redéploiera automatiquement.

### Mettre à jour le dashboard

```bash
git add .
git commit -m "Description des changements"
git push origin main
```

Vercel redéploiera automatiquement.

## 💰 Coûts

**Total : 0€/mois** (tout est gratuit au début)

- Render.com : Gratuit (avec limitations)
- Vercel : Gratuit (illimité pour projets personnels)
- Supabase : Gratuit (500 MB, largement suffisant)
- Groq : Gratuit (14,400 req/jour)

## 🆘 Problèmes courants

### Bot ne démarre pas sur Render

- Vérifiez les logs dans Render
- Vérifiez que toutes les variables d'environnement sont définies
- Vérifiez que `DISCORD_TOKEN` est correct

### Dashboard ne se connecte pas

- Vérifiez la configuration Supabase Auth (voir `dashboard/SUPABASE_AUTH_SETUP.md`)
- Vérifiez que `DISCORD_CLIENT_SECRET` est correct
- Vérifiez les Redirect URLs dans Discord et Supabase

### Erreur "Module not found"

- Vérifiez que `package.json` contient toutes les dépendances
- Vérifiez que `npm install` s'exécute correctement

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Supabase](https://supabase.com/docs)

---

**Bon déploiement ! 🚀**

