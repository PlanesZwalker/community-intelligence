# 📦 Configuration GitHub

Guide pour créer et configurer votre dépôt GitHub.

## 🚀 Créer le dépôt GitHub

### Option 1 : Via l'interface web (Recommandé)

1. Allez sur https://github.com/new
2. Remplissez :
   - **Repository name** : `community-intelligence` (ou autre nom)
   - **Description** : `Bot Discord d'analyse de communauté avec IA générative`
   - **Visibility** : `Public` ou `Private` (votre choix)
   - ⚠️ **NE COCHEZ PAS** "Add a README file" (on en a déjà un)
   - ⚠️ **NE COCHEZ PAS** "Add .gitignore" (on en a déjà un)
3. Cliquez sur **"Create repository"**

### Option 2 : Via GitHub CLI

```bash
gh repo create community-intelligence --public --source=. --remote=origin --push
```

## 🔗 Connecter le dépôt local

Une fois le dépôt créé sur GitHub, connectez-le :

```bash
# Remplacez VOTRE-USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE-USERNAME/community-intelligence.git
git branch -M main
git push -u origin main
```

## ✅ Vérification

Après le push, vous devriez voir tous vos fichiers sur GitHub.

Vérifiez que :
- ✅ Tous les fichiers sont présents
- ✅ Le README.md s'affiche correctement
- ✅ Les dossiers `src/`, `dashboard/`, `supabase/` sont visibles

## 🔄 Commandes Git utiles

### Voir l'état
```bash
git status
```

### Ajouter des changements
```bash
git add .
git commit -m "Description des changements"
git push
```

### Créer une branche
```bash
git checkout -b feature/nom-de-la-feature
```

### Voir l'historique
```bash
git log --oneline
```

## 🚨 Problèmes courants

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/VOTRE-USERNAME/community-intelligence.git
```

### "Permission denied"
- Vérifiez que vous êtes connecté à GitHub
- Utilisez un Personal Access Token si nécessaire

### "Branch 'main' does not exist"
```bash
git branch -M main
```

---

**Une fois le repo créé, suivez [DEPLOYMENT.md](DEPLOYMENT.md) pour déployer ! 🚀**

