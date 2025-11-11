# 🤖 Community Intelligence Bot

Bot Discord d'analyse de communauté avec IA générative - MVP gratuit pour démarrer sans budget.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **🚀 Déploiement rapide** : Voir [QUICK_START.md](docs/QUICK_START.md) pour déployer en 10 minutes !

## 🎯 Fonctionnalités

- ✅ **Collecte automatique des messages** - Stocke tous les messages pour analyse
- ✅ **Statistiques en temps réel** - Commande `/stats` pour voir l'activité
- ✅ **Résumé hebdomadaire** - Commande `/weekly-summary` pour un aperçu de la semaine
- ✅ **Détection de questions** - Identifie les questions posées
- ✅ **Analytics de base** - Membres actifs, canaux populaires, etc.

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
3. Allez dans "SQL Editor"
4. Exécutez le script `supabase/schema.sql` pour créer les tables
5. Allez dans "Settings" > "API"
6. Copiez l'**URL du projet** et la **clé anon public**

### 4. Variables d'environnement

Créez un fichier `.env` à la racine :

```env
DISCORD_TOKEN=votre_token_discord
DISCORD_CLIENT_ID=votre_client_id_discord
SUPABASE_URL=votre_url_supabase
SUPABASE_KEY=votre_cle_supabase
NODE_ENV=production
```

Pour trouver le `DISCORD_CLIENT_ID` : Discord Developer Portal > Votre application > "General Information" > "Application ID"

### 5. Lancer le bot

```bash
npm start
```

Pour le développement avec rechargement automatique :

```bash
npm run dev
```

## 📊 Commandes disponibles

- `/stats` - Affiche les statistiques du serveur
- `/weekly-summary` - Génère un résumé hebdomadaire (avec IA si configurée)
- `/ai-summary` - Résumé intelligent généré par IA (nécessite clé API)
- `/recommendations` - Recommandations d'engagement basées sur l'IA

## 🚢 Déploiement sur Railway (gratuit)

1. Créez un compte sur https://railway.app
2. Cliquez sur "New Project" > "Deploy from GitHub repo"
3. Connectez votre repo GitHub
4. Railway détectera automatiquement Node.js
5. Ajoutez les variables d'environnement dans "Variables"
6. Le bot se déploiera automatiquement !

### Variables à ajouter sur Railway :

- `DISCORD_TOKEN`
- `DISCORD_CLIENT_ID`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `NODE_ENV=production`
- `AI_PROVIDER=groq` (optionnel)
- `GROQ_API_KEY` (optionnel - gratuit sur https://console.groq.com)

## 🤖 Intégration IA (Optionnel - GRATUIT avec Groq !)

Le bot supporte plusieurs providers d'IA pour des fonctionnalités avancées :

### Groq (GRATUIT - Recommandé) ⭐

- **Gratuit** : 14,400 requêtes/jour
- **Très rapide** : Réponses en millisecondes
- **Modèles** : Llama 3.1, Mixtral (open-source)
- **Inscription** : https://console.groq.com

1. Créez un compte Groq
2. Générez une clé API
3. Ajoutez dans `.env` :
   ```env
   AI_PROVIDER=groq
   GROQ_API_KEY=votre_cle_groq
   ```

### Autres options

- **Hugging Face** : Gratuit (30k req/mois) - https://huggingface.co
- **OpenAI** : Payant (5$ crédits gratuits) - https://platform.openai.com
- **Anthropic Claude** : Payant (5$ crédits gratuits) - https://console.anthropic.com

### Commandes IA disponibles

- `/ai-summary` - Résumé intelligent généré par IA
- `/recommendations` - Recommandations d'engagement personnalisées

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

Voir le [README du dashboard](dashboard/README.md) pour les instructions complètes.

**Déploiement rapide sur Vercel :**
1. Allez dans le dossier `dashboard/`
2. Suivez les instructions dans `dashboard/README.md`
3. Déployez sur Vercel (gratuit) en 2 minutes !

## 📈 Prochaines étapes

Une fois que vous avez des revenus, vous pouvez ajouter :

- 📧 **Rapports automatiques** envoyés dans un canal
- 🎯 **Détection de sentiment** avancée
- 👥 **Recommandations d'engagement** plus poussées
- 🔔 **Notifications** dans le dashboard
- 📤 **Export des données** (CSV, PDF)

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
- **Railway/Render** - Hosting gratuit
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

- Le bot collecte uniquement les messages **après** son activation
- Les données sont stockées de manière sécurisée sur Supabase
- Conforme aux règles de Discord (Message Content Intent requis)

## 📜 Licence

Ce projet est sous licence [MIT](LICENSE). Voir [LICENSE_INFO.md](docs/LICENSE_INFO.md) pour plus de détails.

## 🤝 Support

Pour toute question, ouvrez une issue sur GitHub.

---

**Bon lancement ! 🚀**

