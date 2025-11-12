# 🔧 Résoudre l'erreur "You are not authorized" (20012)

## ❌ Problème

Vous voyez cette erreur dans les logs Render :

```
DiscordAPIError[20012]: You are not authorized to perform this action on this application
```

**Cause** : Le `DISCORD_TOKEN` dans Render ne correspond pas au `DISCORD_CLIENT_ID`.

Dans vos logs, vous voyez :
- Bot connecté : `GLSL Shader Bot#5308` (un autre bot)
- CLIENT_ID configuré : `1437809276927213628` (Community Intelligence)

## ✅ Solution

### Option 1 : Utiliser le bon token (Recommandé)

1. **Allez sur Discord Developer Portal** : https://discord.com/developers/applications
2. **Sélectionnez l'application "Community Intelligence"** (ID: `1437809276927213628`)
3. **Allez dans "Bot"** (menu de gauche)
4. **Cliquez sur "Reset Token"** ou copiez le token existant
5. **Dans Render** :
   - Allez dans votre service
   - **Environment** > **Environment Variables**
   - Trouvez `DISCORD_TOKEN`
   - Remplacez la valeur par le token de l'application Community Intelligence
   - Cliquez sur **"Save Changes"**
6. **Redéployez** : Render redéploiera automatiquement

### Option 2 : Utiliser le bon CLIENT_ID

Si vous voulez utiliser le bot "GLSL Shader Bot" :

1. **Trouvez l'ID de l'application GLSL Shader Bot** :
   - Discord Developer Portal > Sélectionnez l'application GLSL Shader Bot
   - **General Information** > Copiez l'**Application ID**
2. **Dans Render** :
   - Remplacez `DISCORD_CLIENT_ID` par l'ID de GLSL Shader Bot
   - Cliquez sur **"Save Changes"**
3. **Redéployez**

## 🔍 Vérification

Après avoir corrigé, les logs devraient montrer :

```
✅ Bot connecté en tant que Community Intelligence#1234
🔄 Enregistrement des commandes...
   Client ID: 1437809276927213628
   Bot connecté: Community Intelligence#1234 (ID: 1437809276927213628)
✅ Commandes enregistrées avec succès!
```

## 📝 Note importante

**Le bot fonctionne même si l'enregistrement des commandes échoue !**

Si vous ne pouvez pas corriger le token immédiatement, vous pouvez :
1. Enregistrer les commandes **manuellement** via Discord Developer Portal
2. Le bot continuera à collecter les messages et fonctionner normalement
3. Les commandes slash ne seront juste pas disponibles automatiquement

### Enregistrer les commandes manuellement

1. Discord Developer Portal > Votre application > **Slash Commands**
2. Cliquez sur **"New Command"**
3. Ajoutez chaque commande :
   - `/stats` - Affiche les statistiques du serveur
   - `/weekly-summary` - Résumé hebdomadaire
   - `/ai-summary` - Résumé IA (si Groq activé)
   - `/recommendations` - Recommandations IA (si Groq activé)

---

**Une fois corrigé, le bot fonctionnera parfaitement ! 🚀**

