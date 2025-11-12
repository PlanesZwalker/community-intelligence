# 🚀 Guide de Déploiement sur Vercel

Ce guide vous explique comment déployer le dashboard Community Intelligence sur Vercel.

## 📋 Prérequis

1. Compte GitHub avec le repo `community-intelligence`
2. Compte Vercel (gratuit) : https://vercel.com
3. Variables d'environnement Supabase configurées

## 🚀 Déploiement Automatique (Recommandé)

### Étape 1 : Connecter Vercel à GitHub

1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"** ou **"Log In"**
3. Connectez-vous avec GitHub
4. Cliquez sur **"Add New Project"**
5. Importez le repo `PlanesZwalker/community-intelligence`

### Étape 2 : Configurer le Projet

1. **Root Directory** : Sélectionnez `dashboard` (important !)
2. **Framework Preset** : Next.js (détecté automatiquement)
3. **Build Command** : `npm run build` (par défaut)
4. **Output Directory** : `.next` (par défaut)
5. **Install Command** : `npm install` (par défaut)

### Étape 3 : Ajouter les Variables d'Environnement

Dans la section **"Environment Variables"**, ajoutez :

```env
NEXT_PUBLIC_SUPABASE_URL=https://twpznfiyatzuwkyfgudh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

**Où trouver ces valeurs :**
- Allez sur https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh/settings/api
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Étape 4 : Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes que le build se termine
3. Votre dashboard sera disponible à l'URL : `https://votre-projet.vercel.app`

### Étape 5 : Configurer le Domaine Personnalisé (Optionnel)

1. Allez dans **Settings** > **Domains**
2. Ajoutez votre domaine personnalisé
3. Suivez les instructions pour configurer les DNS

## 🔄 Déploiement Manuel (Alternative)

Si vous préférez utiliser la CLI Vercel :

```bash
cd dashboard
npm install -g vercel
vercel login
vercel
```

Suivez les instructions à l'écran.

## ✅ Vérification Post-Déploiement

Une fois déployé, vérifiez que :

1. ✅ La landing page est accessible : `https://votre-projet.vercel.app/landing`
2. ✅ La page d'accueil fonctionne : `https://votre-projet.vercel.app`
3. ✅ L'authentification Discord fonctionne
4. ✅ Le dashboard s'affiche après connexion

## 🔧 Configuration des Redirects

Le fichier `vercel.json` est déjà configuré pour :
- Rediriger `/` vers la page d'accueil
- Gérer les routes Next.js correctement

## 🐛 Dépannage

### Erreur "Environment variables not found"

- Vérifiez que les variables commencent par `NEXT_PUBLIC_`
- Vérifiez que les variables sont ajoutées dans Vercel Dashboard > Settings > Environment Variables

### Erreur "Build failed"

- Vérifiez les logs de build dans Vercel Dashboard
- Assurez-vous que `package.json` contient toutes les dépendances
- Vérifiez que le **Root Directory** est bien `dashboard`

### La landing page ne s'affiche pas

- Vérifiez que le fichier `dashboard/app/landing/page.tsx` existe
- Vérifiez que Next.js détecte bien les routes dans `app/`

### Erreur d'authentification Discord

- Vérifiez que les variables Supabase sont correctes
- Vérifiez que Discord OAuth est configuré dans Supabase
- Vérifiez que l'URL de callback Discord correspond à votre domaine Vercel

## 📝 Mise à Jour

À chaque push sur `main`, Vercel redéploiera automatiquement votre dashboard !

Pour forcer un redéploiement :
1. Allez dans Vercel Dashboard
2. Cliquez sur votre projet
3. Cliquez sur **"Redeploy"**

## 🎯 URLs Importantes

- **Landing Page** : `https://votre-projet.vercel.app/landing`
- **Dashboard** : `https://votre-projet.vercel.app/dashboard`
- **Page d'accueil** : `https://votre-projet.vercel.app`

---

**Besoin d'aide ?** Consultez la documentation Vercel : https://vercel.com/docs

