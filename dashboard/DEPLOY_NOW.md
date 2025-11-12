# 🚀 Déploiement Vercel - Guide Rapide

## ⚡ Déploiement en 5 minutes

### 1️⃣ Connecter Vercel à GitHub

1. Allez sur **https://vercel.com**
2. Cliquez sur **"Sign Up"** ou connectez-vous
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repos

### 2️⃣ Importer le Projet

1. Cliquez sur **"Add New Project"**
2. Sélectionnez le repo **`PlanesZwalker/community-intelligence`**
3. Cliquez sur **"Import"**

### 3️⃣ Configuration IMPORTANTE ⚠️

**Root Directory** : 
- Cliquez sur **"Edit"** à côté de "Root Directory"
- Sélectionnez **`dashboard`**
- ⚠️ **C'est crucial !** Sinon Vercel cherchera les fichiers à la racine

**Framework Preset** : Next.js (détecté automatiquement)

### 4️⃣ Variables d'Environnement

Dans la section **"Environment Variables"**, ajoutez :

```
NEXT_PUBLIC_SUPABASE_URL=https://twpznfiyatzuwkyfgudh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase_ici
```

**Où trouver ces valeurs :**
- https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh/settings/api
- Copiez **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copiez **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5️⃣ Déployer !

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes
3. ✅ Votre dashboard est en ligne !

### 6️⃣ Tester

Une fois déployé, testez ces URLs :

- **Landing Page** : `https://votre-projet.vercel.app/landing`
- **Dashboard** : `https://votre-projet.vercel.app/dashboard`
- **Page d'accueil** : `https://votre-projet.vercel.app`

## 🔄 Mise à Jour Automatique

À chaque push sur `main`, Vercel redéploiera automatiquement !

## 🐛 Problèmes Courants

### ❌ "Build failed" - Root Directory incorrect
**Solution** : Vérifiez que Root Directory = `dashboard`

### ❌ "Environment variables not found"
**Solution** : Vérifiez que les variables commencent par `NEXT_PUBLIC_`

### ❌ La landing page ne s'affiche pas
**Solution** : Vérifiez que le build s'est bien terminé et que `/landing` est accessible

## 📞 Support

Pour plus de détails, voir `dashboard/VERCEL_DEPLOY.md`

---

**C'est tout ! Votre dashboard est maintenant en ligne ! 🎉**

