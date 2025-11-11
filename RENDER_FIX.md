# 🔧 Fix Render Deployment

## Problème
Render déploie un ancien commit (e4303d6) au lieu du dernier (18ec192) qui corrige Node.js 20.

## Solutions

### Option 1 : Redéployer manuellement (Recommandé)

1. Allez sur votre dashboard Render
2. Cliquez sur votre service
3. Allez dans "Events" ou "Deploys"
4. Cliquez sur "Manual Deploy" > "Deploy latest commit"
5. Cela devrait déployer le commit 18ec192 avec Node.js 20

### Option 2 : Vérifier la configuration Render

Dans le dashboard Render, vérifiez :

1. **Settings** > **Build Command** : Doit être `npm install`
2. **Settings** > **Start Command** : Doit être `npm start`
3. **Settings** > **Node Version** : Doit être `20` (ou laisser vide pour utiliser .nvmrc)

### Option 3 : Forcer le redéploiement

Si Render ne détecte pas automatiquement le nouveau commit :

1. Dans Render, allez dans **Settings**
2. Changez une variable d'environnement (ajoutez un espace puis supprimez-le)
3. Sauvegardez - cela forcera un redéploiement

### Option 4 : Vérifier que render.yaml est utilisé

Render utilise `render.yaml` seulement si :
- Le fichier est à la racine du repo
- Le service est créé via "New Blueprint" ou "Infrastructure as Code"

Si vous avez créé le service manuellement, vous devez configurer dans le dashboard :
- Node Version : `20`
- Build Command : `npm install`
- Start Command : `npm start`

## Vérifications

Assurez-vous que :
- ✅ `.nvmrc` contient `20`
- ✅ `package.json` a `"node": ">=20.0.0"` dans engines
- ✅ `render.yaml` existe et contient `nodeVersion: 20`
- ✅ Le dernier commit (18ec192) est bien sur GitHub

## Si le problème persiste

Vérifiez les logs de build dans Render pour voir l'erreur exacte.

