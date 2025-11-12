# 🏆 Guide d'Installation - Système de Gamification

Le système de gamification (XP/Levels) est maintenant disponible ! Il permet d'augmenter l'engagement de votre communauté en récompensant les membres actifs.

## 📋 Prérequis

1. Avoir exécuté le schéma de base de données principal (`supabase/schema.sql`)
2. Avoir un bot Discord fonctionnel avec Community Intelligence

## 🚀 Installation

### Étape 1 : Créer les tables dans Supabase

1. Allez sur votre projet Supabase : https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh
2. Cliquez sur **SQL Editor** dans le menu de gauche
3. Cliquez sur **New query**
4. Copiez-collez le contenu du fichier `supabase/schema_gamification.sql`
5. Cliquez sur **Run** (ou `Ctrl+Enter`)
6. Vérifiez que les 3 nouvelles tables apparaissent dans **Table Editor** :
   - ✅ `member_xp` - Stocke l'XP et les niveaux des membres
   - ✅ `guild_xp_rewards` - Configuration des récompenses (rôles)
   - ✅ `guild_xp_config` - Configuration XP par serveur

### Étape 2 : Redéployer le bot

Le code est déjà intégré ! Il suffit de :

1. **Si vous utilisez Render** : Le bot se redéploiera automatiquement après le push Git
2. **Si vous utilisez localement** : Redémarrez le bot avec `npm start`

### Étape 3 : Tester

1. Envoyez quelques messages dans votre serveur Discord
2. Utilisez la commande `/ci-xp` pour voir votre niveau
3. Vérifiez le leaderboard avec `/ci-xp`

## 🎮 Fonctionnalités

### Attribution automatique d'XP

- **+1 XP** par message envoyé
- **+5 XP** bonus pour les questions (messages contenant "?")
- **+3 XP** bonus pour les réponses (messages qui répondent à d'autres messages)
- **+1 XP** par réaction reçue sur un message
- **Cooldown** : 60 secondes entre chaque attribution (évite le spam)

### Calcul des niveaux

La formule utilisée est : `level = floor(sqrt(xp / 100)) + 1`

- **Niveau 1** : 0-99 XP
- **Niveau 2** : 100-399 XP
- **Niveau 3** : 400-899 XP
- **Niveau 4** : 900-1599 XP
- Et ainsi de suite...

### Commandes disponibles

- `/ci-xp` - Affiche votre niveau XP, votre progression, et le leaderboard du serveur

## ⚙️ Configuration

### Personnaliser les récompenses XP

Vous pouvez modifier les valeurs par défaut dans Supabase :

1. Allez dans **Table Editor** > `guild_xp_config`
2. Trouvez ou créez une ligne pour votre `guild_id`
3. Modifiez les valeurs :
   - `xp_per_message` : XP par message (défaut: 1)
   - `xp_per_question` : Bonus XP pour questions (défaut: 5)
   - `xp_per_reply` : Bonus XP pour réponses (défaut: 3)
   - `xp_per_reaction` : XP par réaction (défaut: 1)
   - `cooldown_seconds` : Cooldown entre messages (défaut: 60)
   - `enabled` : Activer/désactiver le système (défaut: true)

### Ajouter des récompenses automatiques (rôles)

Pour attribuer automatiquement des rôles basés sur le niveau :

1. Créez les rôles dans Discord (ex: "Niveau 5", "Niveau 10", etc.)
2. Allez dans **Table Editor** > `guild_xp_rewards`
3. Ajoutez une ligne pour chaque récompense :
   - `guild_id` : ID de votre serveur
   - `level` : Niveau requis (ex: 5)
   - `role_id` : ID du rôle Discord à attribuer

**Note** : L'attribution automatique de rôles n'est pas encore implémentée dans cette version, mais la structure est prête. C'est une feature à venir !

## 📊 Impact attendu

D'après les études de la concurrence (CommunityOne, Arcane), un système de gamification peut :

- **4x d'augmentation d'activité** dans les communautés
- **Réduction de 60% du taux d'abandon** des nouveaux membres
- **Augmentation de 3x des interactions** (réponses aux questions, participation aux discussions)

## 🎯 Prochaines étapes

1. **Récompenses automatiques** : Attribution de rôles basés sur le niveau
2. **Quêtes quotidiennes** : Objectifs personnalisés pour gagner de l'XP bonus
3. **Badges** : Récompenses spéciales pour des actions spécifiques
4. **Leaderboard hebdomadaire** : Classement avec récompenses temporaires

## 🐛 Dépannage

### Le système ne fonctionne pas

1. Vérifiez que les tables existent dans Supabase
2. Vérifiez que `guild_xp_config.enabled = true` pour votre serveur
3. Vérifiez les logs du bot pour voir les erreurs éventuelles

### L'XP n'est pas attribuée

1. Vérifiez le cooldown (60 secondes par défaut)
2. Vérifiez que le bot a les permissions nécessaires
3. Vérifiez que les messages ne sont pas envoyés par des bots (ignorés automatiquement)

### Le leaderboard est vide

1. Attendez que quelques membres envoient des messages
2. Utilisez `/ci-sync-history` pour synchroniser l'historique (l'XP sera calculée rétroactivement pour les nouveaux messages)

## 💡 Astuces

- **Communiquez** sur le système de gamification pour encourager l'engagement
- **Créez des événements** avec bonus XP pour certaines actions
- **Utilisez le leaderboard** pour créer de la compétition amicale
- **Personnalisez les récompenses** selon votre communauté

---

**Besoin d'aide ?** Ouvrez une issue sur GitHub ou consultez la documentation complète dans `docs/GUIDE_COMPLET.md`

