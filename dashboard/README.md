# 📊 Community Intelligence Dashboard

Dashboard web pour visualiser les analytics de votre communauté Discord.

## 🚀 Déploiement sur Vercel (GRATUIT)

### 1. Prérequis

- Compte Vercel (gratuit) : https://vercel.com
- Compte Supabase (déjà configuré pour le bot)
- Application Discord (déjà créée pour le bot)

### 2. Configuration Discord OAuth2

1. Allez sur https://discord.com/developers/applications
2. Sélectionnez votre application
3. Allez dans "OAuth2" > "General"
4. Ajoutez dans "Redirects" :
   - `http://localhost:3000/dashboard` (pour le dev local)
   - `https://votre-app.vercel.app/dashboard` (pour la production)
5. Copiez le **Client Secret** (vous en aurez besoin)

### 3. Configuration Supabase Auth

1. Allez sur votre projet Supabase
2. Allez dans "Authentication" > "Providers"
3. Activez "Discord"
4. Ajoutez :
   - **Client ID** : Votre Discord Client ID
   - **Client Secret** : Votre Discord Client Secret
   - **Redirect URL** : `https://votre-projet.supabase.co/auth/v1/callback`

### 4. Déploiement sur Vercel

#### Option A : Via GitHub (Recommandé)

1. Poussez le code sur GitHub
2. Allez sur https://vercel.com
3. Cliquez sur "New Project"
4. Importez votre repo GitHub
5. Sélectionnez le dossier `dashboard`
6. Ajoutez les variables d'environnement :
   ```
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_supabase
   NEXT_PUBLIC_DISCORD_CLIENT_ID=votre_client_id
   DISCORD_CLIENT_SECRET=votre_client_secret
   NEXTAUTH_URL=https://votre-app.vercel.app
   ```
7. Cliquez sur "Deploy"

#### Option B : Via Vercel CLI

```bash
cd dashboard
npm install -g vercel
vercel
```

Suivez les instructions et ajoutez les variables d'environnement.

### 5. Développement local

```bash
cd dashboard
npm install
npm run dev
```

Ouvrez http://localhost:3000

## 📝 Variables d'environnement

Créez un fichier `.env.local` dans le dossier `dashboard` :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_supabase
NEXT_PUBLIC_DISCORD_CLIENT_ID=votre_client_id
DISCORD_CLIENT_SECRET=votre_client_secret
NEXTAUTH_URL=http://localhost:3000
```

## 🎨 Fonctionnalités

- ✅ Authentification Discord OAuth2
- ✅ Visualisation des statistiques en temps réel
- ✅ Graphiques d'activité (7 derniers jours)
- ✅ Top membres actifs
- ✅ Stats par serveur
- ✅ Design moderne et responsive

## 🔄 Améliorations futures

- [ ] Sélection des serveurs via l'API Discord
- [ ] Filtres par période (jour, semaine, mois)
- [ ] Export des données (CSV, PDF)
- [ ] Notifications et alertes
- [ ] Comparaison entre serveurs
- [ ] Insights IA directement dans le dashboard

## 📚 Documentation

- [Next.js](https://nextjs.org/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Recharts](https://recharts.org/)
- [Vercel](https://vercel.com/docs)

