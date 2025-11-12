# 📚 Guide Complet - Community Intelligence Bot

Guide complet pour installer, configurer et déployer le bot Community Intelligence avec son dashboard web.

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Configuration initiale](#configuration-initiale)
4. [Variables d'environnement](#variables-denvironnement)
5. [Déploiement du Bot (Render)](#déploiement-du-bot-render)
6. [Déploiement du Dashboard (Vercel)](#déploiement-du-dashboard-vercel)
7. [Configuration de l'IA (Groq)](#configuration-de-lia-groq)
8. [Création des tables Supabase](#création-des-tables-supabase)
9. [Configuration Supabase Auth](#configuration-supabase-auth)
10. [Tests et vérification](#tests-et-vérification)
11. [Dépannage](#dépannage)
12. [Informations Discord](#informations-discord)
13. [Politique de confidentialité](#politique-de-confidentialité)

---

## 🎯 Vue d'ensemble

**Community Intelligence** est un bot Discord qui analyse les conversations de votre serveur pour générer des insights actionnables et du contenu automatique.

### Fonctionnalités

- 📊 **Statistiques en temps réel** : `/stats`
- 📝 **Résumés hebdomadaires** : `/weekly-summary`
- 🤖 **Résumés IA** : `/ai-summary` (avec Groq)
- 💡 **Recommandations** : `/recommendations`
- 🌐 **Dashboard web** : Visualisation des analytics

### Stack technique

- **Bot** : Node.js + discord.js
- **Base de données** : Supabase (PostgreSQL)
- **IA** : Groq (gratuit) / OpenAI / Claude
- **Dashboard** : Next.js + TypeScript + Tailwind CSS
- **Hosting** : Render.com (bot) + Vercel (dashboard)

---

## ✅ Prérequis

- Compte GitHub (gratuit)
- Compte Render.com (gratuit)
- Compte Vercel (gratuit)
- Compte Supabase (gratuit)
- Compte Discord Developer (gratuit)
- Node.js 20+ (pour le développement local)

---

## 🔧 Configuration initiale

### 1. Créer le dépôt GitHub

1. Allez sur https://github.com/new
2. Créez un nouveau dépôt (ex: `community-intelligence`)
3. **Ne cochez PAS** "Initialize with README"
4. Copiez l'URL du dépôt

### 2. Initialiser Git

```bash
git init
git add .
git commit -m "Initial commit: Community Intelligence Bot + Dashboard"
git branch -M main
git remote add origin https://github.com/votre-username/community-intelligence.git
git push -u origin main
```

---

## 🔑 Variables d'environnement

### Variables pour le Bot

Créez un fichier `.env` à la **racine** du projet :

```env
# Discord Bot
DISCORD_TOKEN=votre_token_discord
DISCORD_CLIENT_ID=1437809276927213628

# Supabase
SUPABASE_URL=https://twpznfiyatzuwkyfgudh.supabase.co
SUPABASE_KEY=votre_cle_anon_public

# Environment
NODE_ENV=production

# IA (optionnel)
AI_PROVIDER=groq
GROQ_API_KEY=votre_cle_groq
```

### Variables pour le Dashboard

Créez un fichier `.env.local` dans le dossier `dashboard` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://twpznfiyatzuwkyfgudh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_public
NEXT_PUBLIC_DISCORD_CLIENT_ID=1437809276927213628
DISCORD_CLIENT_SECRET=votre_client_secret_discord
NEXTAUTH_URL=http://localhost:3000
```

### Où trouver chaque variable

#### DISCORD_TOKEN

1. Allez sur https://discord.com/developers/applications
2. Sélectionnez votre application
3. **Bot** > **Token** > **Reset Token** ou **Copy**
4. ⚠️ **Copiez-le immédiatement** - vous ne pourrez plus le voir après !

#### DISCORD_CLIENT_ID

1. Discord Developer Portal > **General Information**
2. Copiez l'**Application ID**

#### DISCORD_CLIENT_SECRET

1. Discord Developer Portal > **OAuth2** > **General**
2. **Client Secret** > **Reset Secret** ou **Copy**
3. ⚠️ **Copiez-le immédiatement** - vous ne pourrez plus le voir après !

#### SUPABASE_URL

1. Allez sur https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh
2. **Settings** (⚙️) > **API**
3. Dans **Project URL**, copiez l'URL (format: `https://xxxxx.supabase.co`)

#### SUPABASE_KEY

1. Supabase > **Settings** > **API**
2. Dans **Project API keys**, copiez la clé **"anon public"** (pas "service_role")
3. Elle commence par `eyJ...`

#### GROQ_API_KEY

1. Allez sur https://console.groq.com
2. Créez un compte (gratuit)
3. **API Keys** > **Create API Key**
4. Copiez la clé (commence par `gsk_`)

---

## 🤖 Déploiement du Bot (Render)

### 1. Créer un compte Render

1. Allez sur https://render.com
2. Créez un compte (gratuit)
3. Connectez votre compte GitHub

### 2. Créer un nouveau service

1. **New +** > **Web Service**
2. Connectez votre dépôt GitHub
3. Sélectionnez votre dépôt `community-intelligence`

### 3. Configuration

- **Name** : `community-intelligence-bot`
- **Environment** : `Node`
- **Region** : Choisissez la plus proche
- **Branch** : `main`
- **Root Directory** : `.` (racine)
- **Build Command** : `npm install`
- **Start Command** : `node src/index.js`
- **Plan** : `Free`

### 4. Variables d'environnement dans Render

Dans **Environment Variables**, ajoutez **EXACTEMENT** les mêmes variables que dans votre `.env` :

| Key | Value |
|-----|-------|
| `DISCORD_TOKEN` | `votre_token_discord` |
| `DISCORD_CLIENT_ID` | `1437809276927213628` |
| `SUPABASE_URL` | `https://twpznfiyatzuwkyfgudh.supabase.co` |
| `SUPABASE_KEY` | `votre_cle_anon_public` |
| `NODE_ENV` | `production` |
| `GROQ_API_KEY` | `votre_cle_groq` (optionnel) |

⚠️ **IMPORTANT** :
- Copiez-collez **EXACTEMENT** les valeurs
- Vérifiez qu'il n'y a **PAS d'espaces** avant/après
- Vérifiez que `SUPABASE_URL` commence bien par `https://`
- Cliquez sur **Save Changes** après chaque variable

### 5. Déployer

1. Cliquez sur **Create Web Service**
2. Render va automatiquement cloner, installer et démarrer
3. Attendez que le statut passe à **"Live"** (vert)

### 6. Vérifier le déploiement

Dans les logs, vous devriez voir :

```
✅ Configuration validée
🤖 IA Groq détectée - Fonctionnalités IA activées
🔍 Debug - Variables d'environnement:
   SUPABASE_URL existe: true
   SUPABASE_URL longueur: 42
   SUPABASE_URL (premiers 50 chars): https://twpznfiyatzuwkyfgudh.supabase.co
   ✅ SUPABASE_URL validée: https://twpznfiyatzuwkyfgudh.supabase.co
✅ Bot connecté en tant que VotreBot#1234
✅ Commandes enregistrées
🌐 Serveur HTTP démarré sur le port 10000
```

### Health Check

Ouvrez dans votre navigateur :
```
https://votre-service-render.onrender.com/health
```

Vous devriez voir :
```json
{"status":"ok","bot":"VotreBot#1234"}
```

---

## 📊 Déploiement du Dashboard (Vercel)

### 1. Créer un compte Vercel

1. Allez sur https://vercel.com
2. Créez un compte (gratuit)
3. Connectez votre compte GitHub

### 2. Importer le projet

1. **Add New...** > **Project**
2. Importez votre dépôt GitHub `community-intelligence`
3. Vercel détectera automatiquement Next.js

### 3. Configuration IMPORTANTE ⚠️

- **Framework Preset** : `Next.js` (auto-détecté)
- **Root Directory** : `./dashboard` ⚠️ **CRUCIAL**
- **Build Command** : `npm run build` (automatique)
- **Output Directory** : `.next` (automatique)

### 4. Variables d'environnement dans Vercel

Dans **Environment Variables**, ajoutez :

```
NEXT_PUBLIC_SUPABASE_URL=https://twpznfiyatzuwkyfgudh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_public
NEXT_PUBLIC_DISCORD_CLIENT_ID=1437809276927213628
DISCORD_CLIENT_SECRET=votre_client_secret_discord
```

**Note** : `NEXTAUTH_URL` sera automatiquement défini par Vercel.

### 5. Déployer

1. Cliquez sur **Deploy**
2. Attendez 2-3 minutes
3. Vercel vous donnera une URL (ex: `https://community-intelligence.vercel.app`)

### 6. Configurer les Redirects

#### Dans Discord :

1. Discord Developer Portal > **OAuth2** > **General**
2. Dans **Redirects**, ajoutez :
   - `https://votre-app.vercel.app/dashboard`
   - `https://twpznfiyatzuwkyfgudh.supabase.co/auth/v1/callback`

#### Dans Supabase :

1. Supabase > **Authentication** > **URL Configuration**
2. Ajoutez dans **Redirect URLs** :
   - `https://votre-app.vercel.app/dashboard`

### 7. Développement local

```bash
cd dashboard
npm install
npm run dev
```

Ouvrez http://localhost:3000

---

## 🤖 Configuration de l'IA (Groq)

Groq est **100% gratuit** et parfait pour démarrer !

### Avantages

- ✅ **Gratuit** : 14,400 requêtes/jour
- ✅ **Ultra rapide** : Réponses en millisecondes
- ✅ **Modèles open-source** : Llama 3.1, Mixtral
- ✅ **Pas de carte bancaire** requise

### Étapes

1. Allez sur https://console.groq.com
2. Créez un compte (gratuit) - Google/GitHub/Email
3. **API Keys** > **Create API Key**
4. Donnez un nom (ex: "Community Intelligence Bot")
5. **Copiez la clé** (commence par `gsk_`)

### Configuration

Ajoutez dans votre `.env` :

```env
AI_PROVIDER=groq
GROQ_API_KEY=gsk_votre_cle_ici
```

### Test

Utilisez la commande `/ai-summary` sur votre serveur Discord !

### Limites

- **14,400 requêtes/jour** (gratuit)
- **30 requêtes/minute** (rate limit)
- Suffisant pour **50-100 serveurs** actifs

---

## 🗄️ Création des tables Supabase

**⚠️ CRITIQUE** : Cette étape est **obligatoire** pour que le bot fonctionne. Sans elle, vous obtiendrez l'erreur `"Could not find the table 'public.messages' in the schema cache"`.

### 1. Accéder au SQL Editor

1. Allez sur https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh
2. Dans le menu de gauche, cliquez sur **SQL Editor**
3. Cliquez sur **New query** (bouton en haut à droite)

### 2. Exécuter le script de création des tables

1. **Copiez-collez le script suivant** dans l'éditeur SQL :

```sql
-- Schéma de base de données pour Community Intelligence Bot

-- Table principale pour stocker les messages
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    message_id VARCHAR(255) UNIQUE NOT NULL,
    guild_id VARCHAR(255) NOT NULL,
    channel_id VARCHAR(255) NOT NULL,
    author_id VARCHAR(255) NOT NULL,
    author_username VARCHAR(255) NOT NULL,
    author_display_name VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    has_attachments BOOLEAN DEFAULT FALSE,
    has_embeds BOOLEAN DEFAULT FALSE,
    reaction_count INTEGER DEFAULT 0,
    is_question BOOLEAN DEFAULT FALSE,
    is_reply BOOLEAN DEFAULT FALSE,
    inserted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_messages_guild_id ON messages(guild_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_author_id ON messages(author_id);
CREATE INDEX IF NOT EXISTS idx_messages_channel_id ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_question ON messages(is_question);

-- Table pour stocker les statistiques agrégées (optionnel, pour optimiser)
CREATE TABLE IF NOT EXISTS guild_stats (
    guild_id VARCHAR(255) PRIMARY KEY,
    total_messages BIGINT DEFAULT 0,
    active_members INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les configurations par serveur (pour les fonctionnalités futures)
CREATE TABLE IF NOT EXISTS guild_config (
    guild_id VARCHAR(255) PRIMARY KEY,
    auto_summary_enabled BOOLEAN DEFAULT FALSE,
    summary_channel_id VARCHAR(255),
    summary_frequency VARCHAR(50) DEFAULT 'weekly',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. Cliquez sur **Run** (ou appuyez sur `Ctrl+Enter` / `Cmd+Enter`)
3. Vous devriez voir un message de succès : `Success. No rows returned`

### 3. Vérifier la création des tables

1. Dans le menu de gauche, cliquez sur **Table Editor**
2. Vous devriez voir 3 tables :
   - ✅ `messages` (table principale)
   - ✅ `guild_stats` (statistiques agrégées)
   - ✅ `guild_config` (configurations par serveur)

### 4. Vérifier les permissions

Les tables sont créées avec les permissions par défaut de Supabase. Si vous avez des problèmes d'accès :

1. Allez dans **SQL Editor** > **New query**
2. Exécutez ce script pour donner les permissions nécessaires :

```sql
-- Donner les permissions nécessaires à l'utilisateur anon
GRANT SELECT, INSERT, UPDATE ON messages TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON guild_stats TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON guild_config TO anon, authenticated;

-- Permettre l'utilisation des séquences
GRANT USAGE, SELECT ON SEQUENCE messages_id_seq TO anon, authenticated;
```

### 5. Test

Après avoir créé les tables, le bot devrait pouvoir insérer des messages sans erreur. Vérifiez les logs Render :

```
✅ Bot connecté en tant que VotreBot#1234
✅ Commandes enregistrées
```

**Si vous voyez encore l'erreur `"Could not find the table 'public.messages'"`** :
- Vérifiez que vous avez bien exécuté le script SQL dans le bon projet Supabase
- Vérifiez que les tables apparaissent dans **Table Editor**
- Attendez 1-2 minutes pour que les changements se propagent
- Redémarrez le service Render si nécessaire

---

## 🔐 Configuration Supabase Auth

**⚠️ IMPORTANT** : Cette configuration est **obligatoire** pour que le dashboard fonctionne. Sans elle, vous obtiendrez l'erreur `"Unsupported provider: provider is not enabled"`.

### 1. Activer le provider Discord dans Supabase

1. Allez sur https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh
2. Dans le menu de gauche, cliquez sur **Authentication**
3. Cliquez sur l'onglet **Providers**
4. Faites défiler jusqu'à trouver **Discord** (ou utilisez la recherche)
5. Cliquez sur le bouton **Enable** à côté de Discord
   - Le bouton devrait passer de "Enable" à "Disable" (vert)
   - Si vous voyez "Disable", c'est que Discord est déjà activé ✅

### 2. Configurer Discord OAuth2 dans Discord Developer Portal

**⚠️ IMPORTANT** : Cette étape est **obligatoire** pour éviter l'erreur "Redirect_uri OAuth2 non valide".

1. Allez sur https://discord.com/developers/applications
2. Sélectionnez votre application **Community Intelligence** (ou celle avec l'ID `1437809276927213628`)
3. Dans le menu de gauche, cliquez sur **OAuth2**
4. Faites défiler jusqu'à la section **Redirects**
5. Cliquez sur **Add Redirect** (bouton bleu)
6. **Copiez-collez EXACTEMENT cette URL** (sans espaces avant/après) :
   ```
   https://twpznfiyatzuwkyfgudh.supabase.co/auth/v1/callback
   ```
   ⚠️ **Attention** :
   - L'URL doit commencer par `https://` (pas `http://`)
   - Pas d'espace avant ou après
   - Pas de slash `/` à la fin
   - L'URL doit être **exactement** celle-ci (c'est l'URL de callback de Supabase)
7. Cliquez sur **Save Changes** (en bas de la page)
8. **Vérifiez** que l'URL apparaît bien dans la liste des Redirects
9. **Copiez le Client Secret** :
   - Si vous ne l'avez pas encore, cliquez sur **Reset Secret**
   - **Copiez immédiatement** le secret (il ne sera affiché qu'une fois)
   - Vous en aurez besoin à l'étape suivante

### 3. Configurer les credentials Discord dans Supabase

**⚠️ CRITIQUE** : Cette étape est **obligatoire** pour éviter l'erreur "Unable to exchange external code".

1. Retournez sur Supabase : https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh
2. **Authentication** > **Providers** > **Discord** (cliquez sur le nom "Discord" pour ouvrir les paramètres)
3. Remplissez les champs :
   - **Client ID (for OAuth)** : `1437809276927213628`
   - **Client Secret (for OAuth)** : 
     - ⚠️ **IMPORTANT** : Collez le Client Secret copié depuis Discord Developer Portal (étape 2.9)
     - Le Client Secret doit être **exactement** celui de votre application Discord
     - Si vous avez cliqué sur "Reset Secret" dans Discord, vous DEVEZ utiliser le nouveau secret
     - Vérifiez qu'il n'y a pas d'espaces avant/après
4. Cliquez sur **Save** en bas de la page
5. Vérifiez que vous voyez un message de succès ✅
6. **Vérifiez visuellement** que le Client Secret est bien rempli (il sera masqué par des points, mais le champ ne doit pas être vide)

### 4. Configurer les Redirect URLs dans Supabase

1. Toujours dans Supabase > **Authentication**
2. Cliquez sur l'onglet **URL Configuration** (en haut)
3. Configurez :
   - **Site URL** : 
     - Pour le développement local : `http://localhost:3000`
     - Pour la production : `https://community-intelligence-chi.vercel.app` (ou votre URL Vercel)
   - **Redirect URLs** (cliquez sur "Add URL" pour chaque ligne) :
     ```
     http://localhost:3000/
     http://localhost:3000/dashboard
     https://community-intelligence-chi.vercel.app/
     https://community-intelligence-chi.vercel.app/dashboard
     https://twpznfiyatzuwkyfgudh.supabase.co/auth/v1/callback
     ```
     ⚠️ **Important** : Incluez à la fois `/` (page d'accueil) et `/dashboard` pour permettre le callback OAuth.
4. Cliquez sur **Save**

### 5. Vérification

Après avoir configuré tout cela :

1. Allez sur votre dashboard Vercel : https://community-intelligence-chi.vercel.app
2. Cliquez sur "Se connecter avec Discord"
3. Vous devriez être redirigé vers Discord pour autoriser l'application
4. Après autorisation, vous devriez être redirigé vers le dashboard

**Si vous voyez encore l'erreur `"Unsupported provider"`** :
- Vérifiez que Discord est bien activé dans Supabase (étape 1)
- Vérifiez que les credentials sont corrects (étape 3)
- Attendez 1-2 minutes pour que les changements se propagent
- Rafraîchissez la page du dashboard

**Si vous voyez l'erreur `"Redirect_uri OAuth2 non valide"`** :
- Vérifiez que l'URL `https://twpznfiyatzuwkyfgudh.supabase.co/auth/v1/callback` est bien dans Discord Redirects (étape 2)
- Vérifiez qu'il n'y a pas d'espaces avant/après l'URL
- Vérifiez que l'URL commence bien par `https://` (pas `http://`)
- Vérifiez qu'il n'y a pas de slash `/` à la fin de l'URL
- Supprimez et recréez l'URL dans Discord si nécessaire
- Attendez 1-2 minutes après modification

**Si vous voyez l'erreur `"Unable to exchange external code"`** :
- Vérifiez que le Client Secret dans Supabase correspond exactement à celui dans Discord (étape 3)
- Réinitialisez le Client Secret dans Discord et mettez à jour dans Supabase
- Vérifiez que le Client ID est correct : `1437809276927213628`
- Voir la section [Dépannage](#dépannage) pour plus de détails

---

## ✅ Tests et vérification

### Tester le bot localement

```bash
npm install
npm start
```

Vous devriez voir :
```
✅ Configuration validée
🤖 IA Groq détectée - Fonctionnalités IA activées
✅ Bot connecté en tant que VotreBot#1234
```

### Tester les commandes Discord

1. Allez sur votre serveur Discord
2. Le bot devrait être "en ligne" (point vert)
3. Testez :
   - `/stats` - Statistiques
   - `/weekly-summary` - Résumé hebdomadaire
   - `/ai-summary` - Résumé IA (si Groq configuré)
   - `/recommendations` - Recommandations

### Tester le dashboard

1. Allez sur votre URL Vercel
2. Cliquez sur "Se connecter avec Discord"
3. Vous devriez être redirigé vers Discord puis vers le dashboard
4. Vérifiez que les statistiques s'affichent

---

## 🔧 Dépannage

### Erreur "Could not find the table 'public.messages' in the schema cache"

**Symptôme** :
Dans les logs Render, vous voyez :
```
Erreur lors de l'insertion du message: {
  code: 'PGRST205',
  message: "Could not find the table 'public.messages' in the schema cache"
}
```

**Cause** : Les tables de base de données n'ont pas été créées dans Supabase. Le bot essaie d'insérer des messages mais la table `messages` n'existe pas.

**Solution** :

1. **Créer les tables dans Supabase** :
   - Suivez les instructions dans la section [Création des tables Supabase](#création-des-tables-supabase)
   - Exécutez le script SQL dans le SQL Editor de Supabase
   - Vérifiez que les 3 tables apparaissent dans **Table Editor** :
     - ✅ `messages`
     - ✅ `guild_stats`
     - ✅ `guild_config`

2. **Vérifier les permissions** :
   - Si nécessaire, exécutez le script de permissions (voir section [Création des tables Supabase](#création-des-tables-supabase), étape 4)

3. **Redémarrer le bot** :
   - Dans Render, allez dans votre service
   - Cliquez sur **Manual Deploy** > **Deploy latest commit** (ou redémarrez le service)
   - Attendez que le service soit "Live"

4. **Vérifier les logs** :
   - Les erreurs `PGRST205` devraient disparaître
   - Le bot devrait pouvoir insérer des messages sans erreur

**Voir aussi** : Section [Création des tables Supabase](#création-des-tables-supabase) pour les instructions complètes.

### Erreur "Invalid supabaseUrl"

**Symptôme** :
```
Error: Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.
```

**Solution** :
1. Vérifiez que `SUPABASE_URL` existe dans Render
2. Vérifiez qu'elle commence par `https://`
3. Vérifiez qu'il n'y a pas d'espaces avant/après
4. Supprimez et recréez la variable si nécessaire
5. Redéployez

**Logs de débogage** :
Après le déploiement, vérifiez les logs Render :
```
🔍 Debug - Variables d'environnement:
   SUPABASE_URL existe: true/false
   SUPABASE_URL longueur: X
   SUPABASE_URL (premiers 50 chars): ...
```

### Variables d'environnement manquantes

**Solution** :
1. Vérifiez que toutes les variables sont bien ajoutées dans Render/Vercel
2. Vérifiez qu'il n'y a pas d'espaces dans les valeurs
3. Vérifiez que vous avez cliqué sur **Save Changes**
4. Redéployez

### Bot ne répond pas

**Solution** :
1. Vérifiez que le bot est bien invité sur votre serveur
2. Vérifiez les logs Render pour voir les erreurs
3. Attendez 1h pour que les commandes globales soient disponibles
4. Vérifiez que le bot a les permissions nécessaires

### Erreur "Unsupported provider: provider is not enabled"

**Symptôme** :
```json
{
  "code": 400,
  "error_code": "validation_failed",
  "msg": "Unsupported provider: provider is not enabled"
}
```

**Causes possibles** :
- Discord n'est pas activé dans Supabase Auth
- Les credentials Discord ne sont pas configurés dans Supabase
- Les Redirect URLs ne sont pas configurées correctement

**Solution étape par étape** :

1. **Vérifier que Discord est activé dans Supabase** :
   - Allez sur https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh
   - **Authentication** > **Providers**
   - Vérifiez que Discord affiche "Disable" (vert) et non "Enable"
   - Si vous voyez "Enable", cliquez dessus pour activer Discord

2. **Vérifier les credentials Discord** :
   - Supabase > **Authentication** > **Providers** > **Discord** (cliquez sur le nom)
   - Vérifiez que **Client ID** = `1437809276927213628`
   - Vérifiez que **Client Secret** est rempli (copié depuis Discord Developer Portal)
   - Cliquez sur **Save** si vous avez modifié quelque chose

3. **Vérifier les Redirect URLs** :
   - Discord Developer Portal > **OAuth2** > **Redirects**
   - Doit contenir : `https://twpznfiyatzuwkyfgudh.supabase.co/auth/v1/callback`
   - Supabase > **Authentication** > **URL Configuration**
   - **Site URL** doit être votre URL Vercel (ex: `https://community-intelligence-chi.vercel.app`)
   - **Redirect URLs** doit contenir : `https://community-intelligence-chi.vercel.app/dashboard`

4. **Attendre et réessayer** :
   - Attendez 1-2 minutes après avoir modifié la configuration
   - Rafraîchissez la page du dashboard (Ctrl+F5 ou Cmd+Shift+R)
   - Réessayez de vous connecter

**Voir aussi** : Section [Configuration Supabase Auth](#configuration-supabase-auth) pour les instructions complètes.

### Erreur "Redirect_uri OAuth2 non valide"

**Symptôme** :
```
Redirect_uri OAuth2 non valide
```
ou
```
Invalid redirect_uri
```

**Cause** : L'URL de callback Supabase n'est pas dans la liste des Redirects autorisés de Discord, ou l'URL ne correspond pas exactement.

**Solution étape par étape** :

1. **Vérifier l'URL dans Discord Developer Portal** :
   - Allez sur https://discord.com/developers/applications
   - Sélectionnez votre application **Community Intelligence**
   - **OAuth2** > **Redirects**
   - Vérifiez que cette URL est présente **exactement** (copiez-collez pour vérifier) :
     ```
     https://twpznfiyatzuwkyfgudh.supabase.co/auth/v1/callback
     ```

2. **Si l'URL n'est pas présente ou incorrecte** :
   - Cliquez sur **Add Redirect** (ou supprimez l'ancienne et recréez-la)
   - **Copiez-collez EXACTEMENT** cette URL :
     ```
     https://twpznfiyatzuwkyfgudh.supabase.co/auth/v1/callback
     ```
   - ⚠️ **Vérifications importantes** :
     - ✅ Commence par `https://` (pas `http://`)
     - ✅ Pas d'espace avant ou après
     - ✅ Pas de slash `/` à la fin
     - ✅ Pas de caractères invisibles
   - Cliquez sur **Save Changes**

3. **Vérifier dans Supabase** :
   - Allez sur https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh
   - **Authentication** > **URL Configuration**
   - Vérifiez que **Site URL** = `https://community-intelligence-chi.vercel.app`
   - Vérifiez que **Redirect URLs** contient : `https://community-intelligence-chi.vercel.app/dashboard`

4. **Attendre et réessayer** :
   - Attendez **2-3 minutes** après modification (Discord peut prendre du temps)
   - Rafraîchissez la page du dashboard (Ctrl+F5 ou Cmd+Shift+R)
   - Réessayez de vous connecter

**Astuce** : Si l'erreur persiste, supprimez TOUTES les URLs de Redirects dans Discord, puis ajoutez uniquement :
```
https://twpznfiyatzuwkyfgudh.supabase.co/auth/v1/callback
```

**Voir aussi** : Section [Configuration Supabase Auth](#configuration-supabase-auth) étape 2.

### Erreur "Unable to exchange external code"

**Symptôme** :
```
error=server_error&error_code=unexpected_failure&error_description=Unable+to+exchange+external+code
```

ou dans l'URL après redirection :
```
/dashboard?error=server_error&error_code=unexpected_failure&error_description=Unable+to+exchange+external+code
```

**Cause** : Supabase n'arrive pas à échanger le code d'autorisation Discord contre un token d'accès. Cela signifie généralement que le **Client Secret** dans Supabase est incorrect, manquant, ou ne correspond pas au Client Secret de votre application Discord.

**Solution étape par étape (TRÈS IMPORTANT - Suivez exactement)** :

#### Étape 1 : Réinitialiser le Client Secret dans Discord

1. Allez sur https://discord.com/developers/applications
2. Sélectionnez votre application **Community Intelligence** (ou celle que vous utilisez)
3. Dans le menu de gauche, cliquez sur **OAuth2**
4. Cliquez sur l'onglet **General** (si ce n'est pas déjà fait)
5. Trouvez la section **Client Secret**
6. **⚠️ ACTION IMPORTANTE** : Cliquez sur **Reset Secret**
7. Confirmez en cliquant sur **Yes, do it!**
8. **⚠️ CRITIQUE** : Le nouveau secret s'affiche **UNE SEULE FOIS**. Copiez-le **IMMÉDIATEMENT** :
   - Sélectionnez tout le secret (Ctrl+A ou Cmd+A)
   - Copiez (Ctrl+C ou Cmd+C)
   - Collez-le dans un bloc-notes temporaire pour vérifier qu'il est bien copié
   - Le secret ressemble à : `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (32 caractères alphanumériques)

#### Étape 2 : Vérifier le Client ID dans Discord

1. Toujours dans Discord Developer Portal > OAuth2 > General
2. Notez le **Client ID** (exemple : `1437809276927213628`)
3. Vous en aurez besoin pour l'étape suivante

#### Étape 3 : Vérifier les Redirect URLs dans Discord

1. Toujours dans Discord Developer Portal > OAuth2
2. Cliquez sur l'onglet **General** (si ce n'est pas déjà fait)
3. Faites défiler jusqu'à **Redirects**
4. Vérifiez que cette URL est présente (une seule ligne, exactement comme ci-dessous) :
   ```
   https://twpznfiyatzuwkyfgudh.supabase.co/auth/v1/callback
   ```
5. **⚠️ IMPORTANT** :
   - L'URL doit commencer par `https://` (pas `http://`)
   - Pas d'espace avant ou après
   - Pas de slash à la fin
   - Si l'URL n'existe pas, cliquez sur **Add Redirect** et ajoutez-la
   - Si vous avez plusieurs URLs, vous pouvez les garder, mais celle-ci doit être présente

#### Étape 4 : Mettre à jour le Client Secret dans Supabase

1. Allez sur https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh/auth/providers
2. **⚠️ IMPORTANT** : Cliquez sur le **nom "Discord"** (pas sur le toggle Enable/Disable)
3. Une fenêtre de configuration s'ouvre
4. Dans le champ **Client ID (for OAuth)** :
   - Vérifiez qu'il correspond au Client ID noté à l'étape 2
   - Si différent, remplacez-le par le bon Client ID
5. Dans le champ **Client Secret (for OAuth)** :
   - **Supprimez TOUT** le contenu actuel (Sélectionnez tout avec Ctrl+A, puis Suppr)
   - **Collez** le nouveau Client Secret copié à l'étape 1
   - **⚠️ Vérifiez visuellement** qu'il n'y a pas d'espaces avant ou après
   - Le secret doit commencer et finir par un caractère alphanumérique (pas d'espace)
6. Cliquez sur **Save** en bas de la fenêtre
7. Attendez que le message de confirmation apparaisse

#### Étape 5 : Vérifier que Discord est activé dans Supabase

1. Toujours sur https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh/auth/providers
2. Dans la liste des providers, trouvez **Discord**
3. Vérifiez que le toggle est sur **"Disable"** (vert, à droite)
   - Si vous voyez **"Enable"** (gris), cliquez dessus pour activer Discord
4. Le toggle doit être vert et afficher "Disable" (ce qui signifie que Discord est activé)

#### Étape 6 : Attendre et tester

1. **Attendez 2-3 minutes** après avoir sauvegardé le Client Secret
   - Supabase a besoin de temps pour propager les changements
2. Allez sur https://community-intelligence-chi.vercel.app
3. **Rafraîchissez complètement la page** :
   - Windows : `Ctrl + F5` ou `Ctrl + Shift + R`
   - Mac : `Cmd + Shift + R`
4. Cliquez sur **"Se connecter avec Discord"**
5. Autorisez l'application dans Discord
6. Vous devriez être redirigé vers le dashboard

**Vérifications finales (checklist)** :

- ✅ Client Secret dans Supabase = Client Secret dans Discord (exactement, caractère par caractère)
- ✅ Client ID dans Supabase = Client ID dans Discord
- ✅ Discord est activé dans Supabase (toggle vert "Disable")
- ✅ Redirect URL dans Discord = `https://twpznfiyatzuwkyfgudh.supabase.co/auth/v1/callback`
- ✅ Pas d'espaces avant/après le Client Secret dans Supabase
- ✅ Vous avez attendu 2-3 minutes après la modification

**Si l'erreur persiste après toutes ces étapes** :

1. **Vérifiez que vous utilisez la bonne application Discord** :
   - Dans Discord Developer Portal, vérifiez que vous êtes sur la bonne application
   - Le Client ID doit correspondre à celui utilisé dans Supabase

2. **Réessayez en réinitialisant complètement** :
   - Réinitialisez le Client Secret dans Discord (Reset Secret)
   - Copiez le nouveau secret
   - Mettez à jour dans Supabase
   - Attendez 3-5 minutes
   - Réessayez

3. **Vérifiez les logs Supabase** :
   - Allez sur https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh/logs/explorer
   - Filtrez par "auth" pour voir les erreurs d'authentification
   - Cela peut donner plus d'informations sur l'erreur exacte

**Voir aussi** : Section [Configuration Supabase Auth](#configuration-supabase-auth) étape 3.

### Boucle de redirection après autorisation Discord

**Symptôme** :
- Après avoir autorisé Discord et cliqué sur "Se connecter avec Discord"
- Vous êtes redirigé vers la page d'accueil au lieu du dashboard
- Vous devez réautoriser en boucle

**Cause** : Le callback OAuth n'est pas géré correctement. La session n'est pas créée avant la redirection vers le dashboard.

**Solution** :
1. Vérifiez que le code a été mis à jour (commit `29871e1` ou plus récent)
2. Vérifiez que Vercel a redéployé la dernière version
3. Videz le cache du navigateur (Ctrl+Shift+Delete) ou utilisez une fenêtre privée
4. Réessayez de vous connecter

**Si le problème persiste** :
- Vérifiez les logs de la console du navigateur (F12 > Console)
- Vérifiez que les Redirect URLs dans Supabase incluent bien `/` (page d'accueil)
- Vérifiez que Discord est bien activé dans Supabase

**Voir aussi** : Section [Configuration Supabase Auth](#configuration-supabase-auth).

### Dashboard ne se connecte pas

**Solution** :
1. Vérifiez la configuration Supabase Auth (voir section ci-dessus)
2. Vérifiez que Discord est activé dans Supabase (voir erreur ci-dessus)
3. Vérifiez que `DISCORD_CLIENT_SECRET` est correct
4. Vérifiez les Redirect URLs dans Discord et Supabase
5. Vérifiez que `NEXTAUTH_URL` correspond à votre URL Vercel

### "404 Not Found" après connexion

**Solution** :
1. Vérifiez que les Redirect URLs sont bien configurées dans Discord et Supabase
2. Format : `https://votre-app.vercel.app/dashboard`

### "Invalid redirect URI"

**Solution** :
1. Vérifiez que l'URL dans Discord Redirects correspond exactement à votre URL Vercel
2. Format : `https://votre-app.vercel.app/dashboard`

### Erreur de build

**Solution** :
1. Vérifiez que le Root Directory est bien `dashboard` (pour Vercel)
2. Vérifiez les logs de build dans Vercel/Render
3. Vérifiez que toutes les dépendances sont dans `package.json`

---

## 📝 Informations Discord

### Application Discord

- **Application ID** : `1437809276927213628`
- **Public Key** : `cc3fc1722ea921c80d101acf156b09cbaa2cee5cfc3fe630e46edcddd5213e1d`

### Informations à remplir dans Discord Developer Portal

#### Name
```
Community Intelligence
```

#### Description (400 caractères max)
```
Analysez votre communauté Discord avec l'IA ! 📊

Collecte automatique des messages, statistiques en temps réel, résumés intelligents générés par IA, détection de questions non répondues, et recommandations d'engagement personnalisées.

Parfait pour les community managers qui veulent mieux comprendre et engager leur communauté.

✨ Fonctionnalités :
• Statistiques détaillées (/stats)
• Résumés hebdomadaires avec IA (/weekly-summary)
• Recommandations d'engagement (/recommendations)
• Dashboard web pour visualiser les analytics
```

#### Tags (5 max)
1. `analytics`
2. `community`
3. `ai`
4. `statistics`
5. `management`

#### Interactions Endpoint URL

**LAISSÉE VIDE** - Le bot utilise les interactions Gateway (discord.js standard), pas HTTP.

#### URLs optionnelles

- **Terms of Service URL** : `https://github.com/PlanesZwalker/community-intelligence/blob/main/LICENSE`
- **Privacy Policy URL** : `https://github.com/PlanesZwalker/community-intelligence`

---

## 🔒 Politique de confidentialité

### Données collectées

Le bot collecte les données suivantes pour fournir ses services d'analyse :

- **Messages Discord** : Contenu, auteur, timestamp, canal
- **Métadonnées** : Nom d'utilisateur, nombre de réactions, présence de pièces jointes
- **Statistiques** : Activité des membres, canaux les plus utilisés

### Données NON collectées

- ❌ Messages privés (DMs)
- ❌ Données personnelles sensibles
- ❌ Informations de paiement
- ❌ Mots de passe ou tokens

### Stockage

Les données sont stockées de manière sécurisée sur **Supabase** (PostgreSQL) :
- Chiffrement en transit (HTTPS)
- Chiffrement au repos
- Conformité GDPR

### Sécurité

- Les données sont accessibles uniquement aux administrateurs du serveur
- Aucune donnée n'est partagée avec des tiers
- Les clés API sont stockées de manière sécurisée

### Suppression des données

Vous pouvez demander la suppression de vos données à tout moment :
- Contactez l'administrateur du bot
- Les données seront supprimées dans les 30 jours

---

## 💰 Coûts

**Total : 0€/mois** (tout est gratuit au début)

- Render.com : Gratuit (avec limitations)
- Vercel : Gratuit (illimité pour projets personnels)
- Supabase : Gratuit (500 MB, largement suffisant)
- Groq : Gratuit (14,400 req/jour)

---

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

---

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Discord.js](https://discord.js.org/)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Groq](https://console.groq.com/docs)

---

## 🆘 Support

Pour toute question ou problème :

- **GitHub Issues** : https://github.com/PlanesZwalker/community-intelligence/issues
- **Documentation** : Ce guide complet

---

**Bon déploiement ! 🚀**

> **Note** : Ce document est local uniquement et n'est pas synchronisé avec GitHub (dossier `docs/` dans `.gitignore`).

