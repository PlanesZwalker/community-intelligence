# 🚀 Guide d'Installation - Nouvelles Fonctionnalités

Ce guide explique comment activer les 3 nouvelles fonctionnalités majeures ajoutées.

## 📊 Channel Counters (Compteurs Visuels)

Les channel counters affichent des statistiques en temps réel dans le nom des canaux Discord.

### Installation

1. **Créer la table dans Supabase** :
   - Allez sur https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh
   - SQL Editor > New query
   - Copiez-collez le contenu de `supabase/schema_channel_counters.sql`
   - Run

2. **Le bot met à jour automatiquement** les counters toutes les 5 minutes

### Utilisation

- `/ci-counter create` - Créer un compteur dans le canal actuel
  - Types disponibles :
    - 📊 Membres totaux
    - 💬 Messages totaux
    - 👥 Membres en ligne
    - 💬 Messages aujourd'hui

- `/ci-counter list` - Voir tous les compteurs configurés
- `/ci-counter delete` - Supprimer un compteur

### Exemple

```
Avant : #stats
Après : 📊 Membres: 1,247
```

## 😊 Analyse de Sentiment

Analyse le sentiment des messages avec l'IA Groq (positif/neutre/négatif).

### Prérequis

- `GROQ_API_KEY` configurée dans les variables d'environnement

### Utilisation

- `/ci-sentiment` - Analyse le sentiment du serveur entier
- `/ci-sentiment canal:#général` - Analyse un canal spécifique
- `/ci-sentiment période:7 jours` - Analyser les 7 derniers jours

### Résultats

- Répartition en pourcentage (positif/neutre/négatif)
- Barre de progression visuelle
- Sentiment dominant identifié

## 🎁 Récompenses Automatiques (Rôles XP)

Attribue automatiquement des rôles Discord selon le niveau XP atteint.

### Installation

1. **Créer les rôles dans Discord** :
   - Exemple : "Niveau 5", "Niveau 10", "Niveau 20", etc.

2. **Configurer les récompenses dans Supabase** :
   - Allez dans Table Editor > `guild_xp_rewards`
   - Ajoutez une ligne pour chaque récompense :
     - `guild_id` : ID de votre serveur
     - `level` : Niveau requis (ex: 5)
     - `role_id` : ID du rôle Discord à attribuer

### Comment trouver l'ID d'un rôle

1. Activez le mode développeur dans Discord (Paramètres > Avancé > Mode développeur)
2. Clic droit sur le rôle > Copier l'ID

### Fonctionnement

- Quand un utilisateur monte de niveau, le bot vérifie automatiquement les récompenses
- Les rôles sont attribués automatiquement
- Un message de félicitation est envoyé dans le canal

### Exemple de configuration

| guild_id | level | role_id |
|----------|-------|---------|
| 123456789 | 5 | 987654321 |
| 123456789 | 10 | 987654322 |
| 123456789 | 20 | 987654323 |

## 🔧 Dépannage

### Les channel counters ne se mettent pas à jour

1. Vérifiez que la table `guild_channel_counters` existe
2. Vérifiez que le bot a la permission "Gérer les canaux"
3. Vérifiez les logs du bot pour les erreurs

### L'analyse de sentiment ne fonctionne pas

1. Vérifiez que `GROQ_API_KEY` est configurée
2. Vérifiez qu'il y a des messages à analyser
3. Attendez quelques secondes (l'analyse peut prendre du temps)

### Les récompenses ne sont pas attribuées

1. Vérifiez que les rôles existent dans Discord
2. Vérifiez que le bot a la permission "Gérer les rôles"
3. Vérifiez que les IDs de rôles sont corrects dans Supabase
4. Vérifiez que les utilisateurs montent bien de niveau (utilisez `/ci-xp`)

## 💡 Astuces

- **Channel Counters** : Créez un canal dédié aux statistiques pour un effet visuel maximal
- **Sentiment** : Analysez régulièrement pour détecter les problèmes avant qu'ils ne s'aggravent
- **Récompenses** : Créez des rôles avec des couleurs distinctes pour motiver les membres

---

**Besoin d'aide ?** Ouvrez une issue sur GitHub ou consultez la documentation complète dans `docs/GUIDE_COMPLET.md`

