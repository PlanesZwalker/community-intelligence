# ⚡ Démarrage Rapide

Guide ultra-rapide pour déployer en 10 minutes.

## 🚀 Étapes rapides

### 1. Créer le dépôt GitHub

```bash
# Si vous n'avez pas encore créé le repo GitHub
# 1. Allez sur https://github.com/new
# 2. Créez un repo (ex: "community-intelligence")
# 3. Ne cochez PAS "Initialize with README"
```

### 2. Pousser le code

```bash
git add .
git commit -m "Initial commit: Community Intelligence Bot + Dashboard"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/community-intelligence.git
git push -u origin main
```

### 3. Déployer le Bot (Render.com)

1. Allez sur https://render.com
2. **New +** > **Web Service**
3. Connectez GitHub > Sélectionnez votre repo
4. Configuration :
   - **Name** : `community-intelligence-bot`
   - **Root Directory** : `.` (racine)
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Plan** : `Free`
5. Ajoutez les variables d'environnement (voir `DEPLOYMENT.md`)
6. **Create Web Service**

### 4. Déployer le Dashboard (Vercel)

1. Allez sur https://vercel.com
2. **Add New...** > **Project**
3. Importez votre repo GitHub
4. Configuration :
   - **Root Directory** : `./dashboard` ⚠️
   - **Framework** : Next.js (auto-détecté)
5. Ajoutez les variables d'environnement (voir `DEPLOYMENT.md`)
6. **Deploy**

### 5. Configurer l'authentification

Voir `dashboard/SUPABASE_AUTH_SETUP.md`

## ✅ C'est tout !

Votre bot et dashboard sont maintenant en ligne ! 🎉

---

Pour plus de détails, voir `DEPLOYMENT.md`

