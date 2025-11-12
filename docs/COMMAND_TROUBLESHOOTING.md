# 🔧 Dépannage des Commandes Discord

Guide pour diagnostiquer et résoudre les problèmes avec les commandes du bot.

## ✅ Améliorations Récentes

### Protection contre les Timeouts

Le bot inclut maintenant une protection automatique contre les timeouts Discord (3 secondes) :

- **Réponse automatique** : Si une commande prend plus de 2.5 secondes, le bot diffère automatiquement la réponse
- **Gestion d'erreurs améliorée** : Toutes les erreurs sont capturées et affichées à l'utilisateur
- **Logs détaillés** : Chaque commande logge son exécution pour faciliter le débogage

### Helpers de Réponse Sécurisés

Deux fonctions helper garantissent que toutes les commandes répondent correctement :

- `safeReply()` : Gère automatiquement `reply()`, `editReply()`, ou `followUp()` selon l'état de l'interaction
- `safeDeferReply()` : Diffère la réponse de manière sécurisée, avec fallback si nécessaire

## 🔍 Problèmes Courants

### 1. "Cette interaction a échoué"

**Symptômes** :
- Discord affiche "Cette interaction a échoué"
- La commande ne répond pas du tout

**Causes possibles** :
- La commande n'a pas répondu dans les 3 secondes
- Erreur non gérée dans la commande
- Problème de connexion avec Supabase ou une API externe

**Solutions** :
1. Vérifiez les logs Render pour voir l'erreur exacte
2. La protection timeout devrait maintenant éviter ce problème
3. Redémarrez le bot si le problème persiste

### 2. Commande ne répond pas immédiatement

**Symptômes** :
- La commande prend plusieurs secondes avant de répondre
- Discord affiche "Bot is thinking..."

**Causes possibles** :
- Requête Supabase lente
- Appel API externe (Groq, OpenAI) qui prend du temps
- Traitement de grandes quantités de données

**Solutions** :
- ✅ **Résolu automatiquement** : Le bot diffère maintenant la réponse automatiquement
- Les commandes longues utilisent `deferReply()` pour éviter les timeouts

### 3. Erreur "Interaction ne peut plus répondre"

**Symptômes** :
- Erreur dans les logs : "Interaction ne peut plus répondre"
- La commande ne répond pas

**Causes possibles** :
- Tentative de répondre après 3 secondes sans avoir différé
- Tentative de répondre deux fois à la même interaction

**Solutions** :
- ✅ **Résolu automatiquement** : Les helpers `safeReply()` et `safeDeferReply()` gèrent ces cas
- Vérifiez que toutes les commandes utilisent `deferReply()` si elles prennent du temps

### 4. Commande non trouvée

**Symptômes** :
- Discord affiche "Commande non trouvée"
- La commande n'apparaît pas dans l'autocomplétion

**Causes possibles** :
- Commande non enregistrée sur Discord
- Propagation Discord en cours (peut prendre jusqu'à 1h)
- `DISCORD_CLIENT_ID` ne correspond pas au bot

**Solutions** :
1. Vérifiez que `DISCORD_CLIENT_ID` correspond au bot dans Render
2. Attendez jusqu'à 1h pour la propagation globale
3. Utilisez `GUILD_ID` dans les variables d'environnement pour enregistrement immédiat sur un serveur spécifique

### 5. Erreur dans les logs mais pas d'affichage à l'utilisateur

**Symptômes** :
- Erreurs dans les logs Render
- L'utilisateur ne voit pas de message d'erreur

**Causes possibles** :
- Erreur après avoir déjà répondu
- Erreur dans `deferReply()` ou `editReply()`

**Solutions** :
- ✅ **Résolu automatiquement** : Le handler principal capture toutes les erreurs et affiche un message à l'utilisateur
- Vérifiez les logs pour l'erreur exacte

## 📊 Diagnostic

### Vérifier les Logs Render

1. Allez sur https://dashboard.render.com
2. Sélectionnez votre service bot
3. Cliquez sur "Logs"
4. Recherchez les erreurs avec `❌` ou `⚠️`

### Logs Utiles

Chaque commande logge maintenant :
- `📝 Commande reçue: /nom-commande`
- `✅ Commande trouvée, exécution...`
- `✅ Commande /nom-commande exécutée avec succès`
- `❌ Erreur lors de l'exécution de nom-commande: ...`

### Vérifier les Variables d'Environnement

Assurez-vous que toutes les variables nécessaires sont configurées :

```env
# Discord (requis)
DISCORD_TOKEN=...
DISCORD_CLIENT_ID=...

# Supabase (requis)
SUPABASE_URL=...
SUPABASE_KEY=...

# IA (optionnel)
GROQ_API_KEY=...
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...

# Stripe (optionnel)
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

## 🛠️ Commandes Spécifiques

### `/ci-stats`
- **Problème** : Ne répond pas
- **Solution** : Vérifiez la connexion Supabase et que la table `messages` existe

### `/ci-ai-summary`
- **Problème** : "Aucune clé API IA configurée"
- **Solution** : Ajoutez `GROQ_API_KEY` dans Render
- **Problème** : "Consentement IA non donné"
- **Solution** : Utilisez `/ci-ai-consent give` pour donner le consentement

### `/ci-upgrade`
- **Problème** : "Plan null invalide"
- **Solution** : Vérifiez que les options de commande sont bien enregistrées (peut prendre jusqu'à 1h)
- **Problème** : "STRIPE_SECRET_KEY non configurée"
- **Solution** : Ajoutez la clé Stripe dans Render

### `/ci-sync-history`
- **Problème** : Prend très longtemps
- **Solution** : Normal, cette commande traite beaucoup de données. Le bot diffère automatiquement la réponse.

## 🔄 Redémarrer le Bot

Si les problèmes persistent :

1. Allez sur Render Dashboard
2. Sélectionnez votre service
3. Cliquez sur "Manual Deploy" > "Clear build cache & deploy"
4. Attendez le redéploiement

## 📝 Vérifier l'Enregistrement des Commandes

Les commandes doivent être enregistrées sur Discord. Vérifiez dans les logs au démarrage :

```
✅ Commandes enregistrées avec succès!
   Commandes enregistrées: ci-stats, ci-weekly-summary, ...
```

Si vous voyez une erreur :
- Vérifiez que `DISCORD_TOKEN` et `DISCORD_CLIENT_ID` correspondent à la même application Discord
- Les commandes peuvent être enregistrées manuellement via Discord Developer Portal

## 🆘 Support

Si le problème persiste :

1. Vérifiez les logs Render complets
2. Vérifiez que toutes les variables d'environnement sont correctes
3. Rejoignez le serveur Discord de support : https://discord.gg/community-intelligence
4. Fournissez :
   - Les logs Render (dernières 100 lignes)
   - La commande qui ne fonctionne pas
   - Les variables d'environnement configurées (sans les valeurs sensibles)

---

**Dernière mise à jour** : {new Date().toLocaleDateString('fr-FR')}

