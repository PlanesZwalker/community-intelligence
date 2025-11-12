# 🔄 Mise à Jour du Projet Vercel Existant

Vous avez déjà un projet Vercel : **community-intelligence**

## ✅ Vérifications à Faire

### 1. Vérifier le Root Directory

1. Allez sur https://vercel.com/annjs-projects/community-intelligence
2. Cliquez sur **"Settings"**
3. Allez dans **"General"** > **"Root Directory"**
4. **Vérifiez que c'est configuré sur `dashboard`**
   - Si ce n'est pas le cas, cliquez sur **"Edit"**
   - Sélectionnez **`dashboard`**
   - Cliquez sur **"Save"**

### 2. Vérifier les Variables d'Environnement

1. Dans **"Settings"**, allez dans **"Environment Variables"**
2. **Vérifiez que ces variables existent :**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://twpznfiyatzuwkyfgudh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
   ```
3. **Si elles n'existent pas**, ajoutez-les :
   - Cliquez sur **"Add New"**
   - Ajoutez chaque variable
   - Sélectionnez **"Production"**, **"Preview"**, et **"Development"**
   - Cliquez sur **"Save"**

### 3. Connecter Git (si pas déjà fait)

1. Dans **"Settings"**, allez dans **"Git"**
2. Si le repo n'est pas connecté :
   - Cliquez sur **"Connect Git Repository"**
   - Sélectionnez **`PlanesZwalker/community-intelligence`**
   - Autorisez l'accès si nécessaire

### 4. Redéployer

Une fois les configurations mises à jour :

1. Allez dans l'onglet **"Deployments"**
2. Cliquez sur les **"..."** du dernier déploiement
3. Cliquez sur **"Redeploy"**
4. Ou simplement faites un **push sur `main`** pour déclencher un nouveau déploiement automatique

## 🎯 URLs de Votre Projet

Une fois redéployé, vos URLs seront :

- **Landing Page** : `https://community-intelligence.vercel.app/landing`
- **Dashboard** : `https://community-intelligence.vercel.app/dashboard`
- **Page d'accueil** : `https://community-intelligence.vercel.app`

## 🔍 Vérification Post-Déploiement

1. ✅ La landing page s'affiche : `/landing`
2. ✅ Le design est correct (gradients, cartes, pricing)
3. ✅ Les liens fonctionnent (invitation bot, dashboard)
4. ✅ L'authentification Discord fonctionne

## 🐛 Si le Déploiement Échoue

### Erreur "Build failed"

1. Vérifiez les **logs de build** dans l'onglet "Deployments"
2. Vérifiez que **Root Directory = `dashboard`**
3. Vérifiez que toutes les dépendances sont dans `dashboard/package.json`

### Erreur "Environment variables not found"

1. Vérifiez que les variables commencent par `NEXT_PUBLIC_`
2. Vérifiez qu'elles sont ajoutées pour **Production**, **Preview**, et **Development**

### La landing page ne s'affiche pas

1. Vérifiez que le fichier `dashboard/app/landing/page.tsx` existe
2. Vérifiez les logs pour voir si Next.js détecte bien la route

## 📝 Mise à Jour Automatique

À chaque push sur `main`, Vercel redéploiera automatiquement votre projet !

Pour forcer un redéploiement maintenant :
```bash
git push origin main
```

---

**Votre projet est déjà configuré ! Il suffit de vérifier ces paramètres et redéployer.** 🚀

