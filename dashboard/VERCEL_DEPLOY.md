# 🚀 Déploiement Rapide sur Vercel

Guide étape par étape pour déployer le dashboard en 5 minutes.

## ⚡ Déploiement Express

### Étape 1 : Préparer GitHub

Assurez-vous que votre code est poussé sur GitHub :

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Étape 2 : Créer un compte Vercel

1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"** (gratuit)
3. Connectez-vous avec **GitHub** (recommandé)

### Étape 3 : Importer le projet

1. Dans le dashboard Vercel, cliquez sur **"Add New..."** > **"Project"**
2. Sélectionnez votre repo : `PlanesZwalker/community-intelligence`
3. Vercel détectera automatiquement Next.js

### Étape 4 : Configuration IMPORTANTE ⚠️

**Root Directory** : 
- Cliquez sur **"Edit"** à côté de "Root Directory"
- Entrez : `dashboard`
- ⚠️ **C'EST CRUCIAL** - Sinon Vercel cherchera dans la racine !

**Framework Preset** : Next.js (auto-détecté)

### Étape 5 : Variables d'environnement

Cliquez sur **"Environment Variables"** et ajoutez :

```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_supabase
NEXT_PUBLIC_DISCORD_CLIENT_ID=votre_client_id_discord
DISCORD_CLIENT_SECRET=votre_client_secret_discord
```

**Note** : `NEXTAUTH_URL` sera automatiquement défini par Vercel, vous n'avez pas besoin de l'ajouter.

### Étape 6 : Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes
3. Vercel vous donnera une URL (ex: `https://community-intelligence.vercel.app`)

### Étape 7 : Configurer les Redirects

Une fois déployé, vous devez configurer les redirects :

#### Dans Discord :
1. Allez sur https://discord.com/developers/applications
2. Votre application > **OAuth2** > **General**
3. Ajoutez dans **Redirects** :
   - `https://votre-app.vercel.app/dashboard`
   - `https://votre-projet.supabase.co/auth/v1/callback`

#### Dans Supabase :
1. Allez sur votre projet Supabase
2. **Authentication** > **URL Configuration**
3. Ajoutez dans **Redirect URLs** :
   - `https://votre-app.vercel.app/dashboard`

## ✅ Vérification

1. Allez sur votre URL Vercel
2. Vous devriez voir la page de connexion Discord
3. Cliquez sur "Se connecter avec Discord"
4. Vous devriez être redirigé vers Discord puis vers le dashboard

## 🔧 Problèmes courants

### "404 Not Found" après connexion

**Solution** : Vérifiez que les Redirect URLs sont bien configurées dans Discord et Supabase.

### "Invalid redirect URI"

**Solution** : 
- Vérifiez que l'URL dans Discord Redirects correspond exactement à votre URL Vercel
- Format : `https://votre-app.vercel.app/dashboard`

### Erreur de build

**Solution** :
- Vérifiez que le Root Directory est bien `dashboard`
- Vérifiez les logs de build dans Vercel
- Vérifiez que toutes les dépendances sont dans `package.json`

## 📝 Commandes utiles

### Déploiement local (test)

```bash
cd dashboard
npm install
npm run dev
```

Ouvrez http://localhost:3000

### Build de test

```bash
cd dashboard
npm run build
npm start
```

## 🔗 Liens utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Next.js sur Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

---

**Votre dashboard sera en ligne en quelques minutes ! 🎉**

