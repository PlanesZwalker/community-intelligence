# 🤖 Community Intelligence Bot

Bot Discord d'analyse de communauté avec IA générative - MVP gratuit pour démarrer sans budget.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **🚀 Déploiement rapide** : Voir la documentation dans le dossier `docs/` (local uniquement)

## 🎯 Fonctionnalités

- ✅ **Collecte automatique des messages** - Stocke tous les messages pour analyse
- ✅ **Statistiques en temps réel** - Commande `/ci-stats` pour voir l'activité
- ✅ **Résumé hebdomadaire** - Commande `/ci-weekly-summary` pour un aperçu de la semaine
- ✅ **Résumé IA intelligent** - Commande `/ci-ai-summary` avec Groq (gratuit)
- ✅ **Détection de questions** - Identifie les questions posées
- ✅ **Analytics de base** - Membres actifs, canaux populaires, etc.
- 🏆 **Système de gamification** - XP/Levels avec leaderboard pour augmenter l'engagement (4x d'activité selon les études)
- 🤖 **Détection de bots/spam** - Identifie les comptes suspects et les patterns de spam
- 🧠 **Résumé IA avancé** - Chunking intelligent pour analyser TOUS les messages (même des milliers)
- 📊 **Channel Counters** - Compteurs visuels dans les canaux (membres, messages, en ligne)
- 😊 **Analyse de sentiment** - Détection du sentiment des messages avec IA (positif/neutre/négatif)
- 🎁 **Récompenses automatiques** - Attribution automatique de rôles basés sur le niveau XP
- 🔮 **Prédictions proactives** - Alertes et prédictions basées sur les tendances (game-changer)
- 🎯 **Quêtes personnalisées** - Quêtes quotidiennes générées par IA pour chaque membre (4x engagement)
- 📊 **Mod Performance** - Suivi de la performance des modérateurs avec métriques détaillées
- 🎤 **Voice Analytics** - Tracking complet de l'activité vocale (temps, canaux, heures de pic)
- 🛡️ **Score de confiance** - Détection avancée de spam avec score 0-100 par membre
- 🏆 **Badges visuels** - Système d'achievements avec badges débloquables
- 👋 **Onboarding intelligent** - Accueil automatique personnalisé avec suggestions de rôles/canaux
- 💳 **Intégration Stripe** - Paiements sécurisés avec checkout et portail de facturation

## 🚀 Installation

### Prérequis

- Node.js 18+ 
- Compte Discord Developer
- Compte Supabase (gratuit)

### 1. Cloner et installer

```bash
npm install
```

### 2. Configuration Discord

1. Allez sur https://discord.com/developers/applications
2. Créez une nouvelle application
3. Allez dans "Bot" et créez un bot
4. Copiez le **Token** (vous en aurez besoin)
5. Activez les **Privileged Gateway Intents** :
   - ✅ MESSAGE CONTENT INTENT
   - ✅ SERVER MEMBERS INTENT
6. Allez dans "OAuth2" > "URL Generator"
7. Sélectionnez les scopes : `bot`, `applications.commands`
8. Sélectionnez les permissions : `Read Messages`, `Send Messages`, `Read Message History`
9. Invitez le bot sur votre serveur avec l'URL générée

### 3. Configuration Supabase

1. Créez un compte sur https://supabase.com (gratuit)
2. Créez un nouveau projet
3. **⚠️ IMPORTANT** : Créez les tables de base de données :
   - Allez dans "SQL Editor"
   - Cliquez sur "New query"
   - Copiez-collez le contenu du fichier `supabase/schema.sql`
   - Cliquez sur "Run" (ou `Ctrl+Enter`)
   - Vérifiez que les 3 tables apparaissent dans "Table Editor" :
     - ✅ `messages`
     - ✅ `guild_stats`
     - ✅ `guild_config`
4. Allez dans "Settings" > "API"
5. Copiez l'**URL du projet** et la **clé anon public**

📖 **Guide détaillé** : Voir la section [Création des tables Supabase](#création-des-tables-supabase) dans `docs/GUIDE_COMPLET.md`

### 🏆 Système de Gamification (Nouveau !)

Le bot inclut maintenant un système de gamification pour augmenter l'engagement :

1. **Exécutez le schéma de gamification** :
   - Allez dans Supabase > SQL Editor
   - Copiez-collez le contenu de `supabase/schema_gamification.sql`
   - Cliquez sur "Run"

2. **Le système est automatiquement activé** après redéploiement du bot

3. **Utilisez `/ci-xp`** pour voir votre niveau et le leaderboard

📖 **Guide complet** : Voir `docs/GAMIFICATION_SETUP.md` pour la configuration avancée

### 4. Variables d'environnement

Créez un fichier `.env` à la racine :

```env
DISCORD_TOKEN=votre_token_discord
DISCORD_CLIENT_ID=votre_client_id_discord
SUPABASE_URL=votre_url_supabase
SUPABASE_KEY=votre_cle_supabase
NODE_ENV=production
```

**Où trouver ces valeurs :**
- **DISCORD_TOKEN** : Discord Developer Portal > Bot > Token
- **DISCORD_CLIENT_ID** : Discord Developer Portal > General Information > Application ID
- **SUPABASE_URL** : Supabase > Settings > API > Project URL
- **SUPABASE_KEY** : Supabase > Settings > API > anon public key

📖 **Guide complet** : Voir la documentation dans `docs/` (local uniquement)

💡 **Votre projet Supabase** : https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh

### 5. Lancer le bot

```bash
npm start
```

Pour le développement avec rechargement automatique :

```bash
npm run dev
```

## 📊 Commandes disponibles

- `/ci-stats` - Affiche les statistiques du serveur
- `/ci-weekly-summary` - Génère un résumé hebdomadaire (avec IA si configurée)
- `/ci-ai-summary` - Résumé intelligent généré par IA avec chunking intelligent (traite TOUS les messages)
- `/ci-recommendations` - Recommandations d'engagement basées sur l'IA
- `/ci-sync-history` - Synchronise l'historique des messages depuis Discord vers la base de données
- `/ci-xp` - Affiche votre niveau XP et le leaderboard du serveur (🏆 Gamification)
- `/ci-bot-detection` - Détecte les bots et spam dans votre serveur (🤖 Anti-spam)
- `/ci-counter` - Gère les compteurs visuels dans les canaux (📊 Channel Counters)
- `/ci-sentiment` - Analyse le sentiment des messages (😊 Sentiment Analysis)
- `/ci-predictions` - 🔮 Prédictions et alertes proactives pour les 7 prochains jours
- `/ci-quest` - 🎯 Quêtes personnalisées quotidiennes générées par IA
- `/ci-mod-report` - 📊 Rapport de performance des modérateurs
- `/ci-voice-stats` - 🎤 Statistiques de l'activité vocale du serveur
- `/ci-trust-score` - 🛡️ Score de confiance d'un membre (détection spam avancée)
- `/ci-badges` - 🏆 Badges et achievements visuels
- `/ci-upgrade` - 💳 Passer à un plan premium (Stripe)
- `/ci-billing` - 💳 Gérer votre abonnement et factures
- `/ci-plan` - 📊 Affiche votre plan actuel et les fonctionnalités disponibles

> **⏱️ Note importante** : Les commandes globales peuvent prendre jusqu'à **1 heure** pour apparaître dans Discord après l'enregistrement. Si les commandes n'apparaissent pas immédiatement, attendez quelques minutes ou utilisez-les directement en tapant `/ci-stats` même si elles n'apparaissent pas dans l'autocomplétion.

### 🔄 Synchronisation de l'historique

Par défaut, le bot collecte uniquement les **nouveaux messages** envoyés après son activation. Pour récupérer l'historique des messages passés :

1. **Manuellement** : Utilisez la commande `/ci-sync-history` dans Discord
   - Récupère jusqu'à 100 messages par canal
   - Traite jusqu'à 50 canaux par serveur
   - Peut prendre plusieurs minutes selon le nombre de canaux

2. **Automatiquement au démarrage** : Ajoutez dans vos variables d'environnement :
   ```env
   SYNC_HISTORY_ON_START=true
   ```
   ⚠️ **Attention** : Cela peut ralentir le démarrage du bot si vous avez beaucoup de canaux.

> **💡 Note** : La synchronisation vérifie automatiquement les doublons, vous pouvez l'exécuter plusieurs fois sans risque.

## 🚢 Déploiement sur Render (gratuit)

1. Créez un compte sur https://render.com
2. Cliquez sur "New +" > "Web Service"
3. Connectez votre repo GitHub
4. Configurez le service :
   - **Name** : `community-intelligence-bot` (ou votre choix)
   - **Environment** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `node src/index.js`
   - **Plan** : Free (gratuit)
5. Ajoutez les variables d'environnement dans "Environment"
6. Cliquez sur "Create Web Service"
7. Le bot se déploiera automatiquement !

### Variables à ajouter sur Render :

- `DISCORD_TOKEN`
- `DISCORD_CLIENT_ID`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `NODE_ENV=production`
- `AI_PROVIDER=groq` (optionnel)
- `GROQ_API_KEY` (optionnel - gratuit sur https://console.groq.com)
- `SYNC_HISTORY_ON_START=true` (optionnel - synchronise l'historique au démarrage)

## 🤖 Intégration IA (Optionnel - GRATUIT avec Groq !)

Le bot supporte plusieurs providers d'IA pour des fonctionnalités avancées :

### Groq (GRATUIT - Recommandé) ⭐

- **Gratuit** : 14,400 requêtes/jour (plan gratuit)
- **Très rapide** : Réponses en millisecondes
- **Modèles GRATUITS utilisés** (plan gratuit uniquement) : 
  - `llama-3.1-8b-instant` (560 t/s - le moins cher, recommandé)
  - `openai/gpt-oss-20b` (1000 t/s - très rapide)
  - `llama-3.3-70b-versatile` (280 t/s - meilleure qualité si quota disponible)
- **⚠️ Important** : Tous ces modèles sont gratuits dans le plan gratuit de Groq
- **Documentation** : https://console.groq.com/docs/models
- **Inscription** : https://console.groq.com

**⚠️ Important** : Si un lien d'authentification ne fonctionne pas, allez directement sur https://console.groq.com et créez un compte normalement.

1. Allez sur https://console.groq.com
2. Cliquez sur **"Sign Up"** (gratuit)
3. Connectez-vous avec Google, GitHub ou Email
4. Allez dans **"API Keys"** et créez une clé
5. Ajoutez dans `.env` :
   ```env
   AI_PROVIDER=groq
   GROQ_API_KEY=votre_cle_groq
   ```

📖 **Guide complet** : Voir la documentation dans le dossier `docs/` (local uniquement)

### Autres options

- **Hugging Face** : Gratuit (30k req/mois) - https://huggingface.co
- **OpenAI** : Payant (5$ crédits gratuits) - https://platform.openai.com
- **Anthropic Claude** : Payant (5$ crédits gratuits) - https://console.anthropic.com

### Commandes IA disponibles

- `/ci-ai-summary` - Résumé intelligent généré par IA
- `/ci-recommendations` - Recommandations d'engagement personnalisées

## 📊 Dashboard Web

Un dashboard web moderne est disponible dans le dossier `dashboard/` pour visualiser vos analytics !

### Fonctionnalités du dashboard

- ✅ Authentification Discord OAuth2
- ✅ Visualisation des statistiques en temps réel
- ✅ Graphiques d'activité (7 derniers jours)
- ✅ Top membres actifs
- ✅ Stats par serveur
- ✅ Design moderne et responsive

### Déploiement

Voir la documentation dans le dossier `docs/` (local uniquement) pour les instructions complètes.

**Déploiement rapide sur Vercel :**
1. Voir la documentation dans `dashboard/VERCEL_DEPLOY.md`
2. Connectez votre repo GitHub à Vercel
3. Configurez le **Root Directory** : `dashboard`
4. Ajoutez les variables d'environnement Supabase
5. Déployez en 2 minutes !

📖 **Guide complet** : Voir `dashboard/VERCEL_DEPLOY.md`

## 📈 Prochaines étapes

Une fois que vous avez des revenus, vous pouvez ajouter :

- 📧 **Rapports automatiques** envoyés dans un canal
- 🎯 **Détection de sentiment** avancée
- 👥 **Recommandations d'engagement** plus poussées
- 🔔 **Notifications** dans le dashboard
- 📤 **Export des données** (CSV, PDF)

## 💰 Système de Monétisation (En Développement)

Le bot supporte un système de plans premium pour monétiser vos fonctionnalités :

### Plans Disponibles

- **🆓 Free** : 10,000 messages, 10 canaux, fonctionnalités de base
- **💎 Pro (15€/mois)** : Illimité, IA, exports, rapports automatiques
- **🏢 Enterprise (50€/mois)** : Tout Pro + API REST, webhooks, support dédié

### Fonctionnalités Premium

- ✅ **Rapports automatiques** - Envoi automatique de résumés dans un canal
- ✅ **Export de données** - CSV, JSON, PDF
- ✅ **Analytics avancés** - Sentiment, tendances, prédictions
- ✅ **API REST** - Intégrations personnalisées (Enterprise)
- ✅ **Webhooks** - Notifications d'événements (Enterprise)

📖 **Documentation complète** : Voir `docs/MONETIZATION_PLAN.md` et `docs/IMPLEMENTATION_GUIDE.md`

### Implémentation

Le système de monétisation est prêt à être activé :
1. Exécutez `supabase/schema_premium.sql` pour créer les tables
2. Utilisez `src/utils/premium.js` pour gérer les plans et limites
3. Intégrez Stripe pour les paiements (optionnel)
4. Ajoutez les commandes `/ci-plan` et `/ci-upgrade`

## 💰 Stratégie de monétisation

1. **Phase 1** : Service manuel (0€)
   - Collectez les données automatiquement
   - Analysez manuellement et envoyez des rapports
   - Prix : 10-15€/mois pour valider le concept

2. **Phase 2** : Automatisation (avec revenus Phase 1)
   - Intégrez Claude API (~30-50€/mois)
   - Automatisez les rapports
   - Prix : 15-30€/mois

3. **Phase 3** : Scale
   - Ajoutez un dashboard web
   - Fonctionnalités avancées
   - Prix : 30-100€/mois selon les features

## 🛠️ Stack technique

### Bot Discord
- **Node.js** + **discord.js** - Bot Discord
- **Supabase** - Base de données PostgreSQL gratuite
- **Render** - Hosting gratuit (recommandé)
- **Groq API** - IA générative gratuite (recommandé)
- **Alternatives** : OpenAI, Anthropic Claude, Hugging Face

### Dashboard Web
- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Recharts** - Graphiques
- **Vercel** - Hosting gratuit
- **Supabase Auth** - Authentification Discord OAuth2

## 📝 Notes

- Par défaut, le bot collecte uniquement les messages **après** son activation
- Utilisez `/ci-sync-history` pour récupérer l'historique des messages passés
- Les données sont stockées de manière sécurisée sur Supabase
- Conforme aux règles de Discord (Message Content Intent requis)

## 📜 Licence

Ce projet est sous licence [MIT](LICENSE).

## 🤝 Support

Pour toute question, ouvrez une issue sur GitHub.

---

**Bon lancement ! 🚀**

