# 📁 Structure du Projet Community Intelligence

## 📂 Organisation des Fichiers

```
community-intelligence/
│
├── 📄 README.md                    # Documentation principale du projet
├── 📄 LICENSE                      # Licence MIT
├── 📄 package.json                 # Dépendances Node.js du bot
├── 📄 render.yaml                  # Configuration Render (déploiement)
├── 📄 railway.json                 # Configuration Railway (ancien, peut être supprimé)
├── 📄 .gitignore                   # Fichiers ignorés par Git
│
├── 📁 src/                         # Code source du bot Discord
│   ├── 📄 index.js                 # Point d'entrée principal
│   │
│   ├── 📁 handlers/               # Gestionnaires d'événements
│   │   ├── commandHandler.js       # Gestion des commandes slash
│   │   └── messageHandler.js       # Gestion des messages
│   │
│   └── 📁 utils/                   # Utilitaires et services
│       ├── aiService.js            # Service IA (Groq, OpenAI, etc.)
│       ├── analytics.js            # Analytics de base
│       ├── badges.js               # Système de badges
│       ├── botDetection.js         # Détection bots/spam
│       ├── channelCounters.js      # Compteurs de canaux
│       ├── checkConfig.js          # Vérification configuration
│       ├── chunkedSummary.js       # Résumé IA avec chunking
│       ├── onboarding.js           # Onboarding intelligent
│       ├── predictions.js          # Prédictions et alertes
│       ├── premium.js              # Gestion plans premium
│       ├── questSystem.js          # Système de quêtes
│       ├── registerCommands.js     # Enregistrement commandes Discord
│       ├── sentimentAnalysis.js    # Analyse de sentiment
│       ├── stripe.js               # Intégration Stripe (paiements)
│       ├── syncHistory.js          # Synchronisation historique
│       ├── voiceAnalytics.js       # Analytics vocales
│       ├── weeklySummary.js        # Résumé hebdomadaire
│       ├── xpRewards.js            # Récompenses XP
│       └── xpSystem.js             # Système XP/Levels
│
├── 📁 dashboard/                   # Dashboard web Next.js
│   ├── 📄 package.json             # Dépendances Next.js
│   ├── 📄 next.config.js           # Configuration Next.js
│   ├── 📄 tailwind.config.js       # Configuration Tailwind CSS
│   ├── 📄 tsconfig.json            # Configuration TypeScript
│   ├── 📄 vercel.json              # Configuration Vercel
│   │
│   ├── 📁 app/                     # Pages Next.js (App Router)
│   │   ├── 📄 layout.tsx           # Layout principal
│   │   ├── 📄 page.tsx             # Page d'accueil (login)
│   │   ├── 📄 globals.css          # Styles globaux
│   │   ├── 📁 dashboard/           # Dashboard utilisateur
│   │   │   └── 📄 page.tsx
│   │   └── 📁 landing/             # Landing page publique
│   │       └── 📄 page.tsx
│   │
│   └── 📁 docs/                     # Documentation dashboard
│       ├── DEPLOY_NOW.md           # Déploiement rapide
│       ├── VERCEL_DEPLOY.md        # Guide déploiement Vercel
│       └── VERCEL_UPDATE.md        # Mise à jour Vercel
│
├── 📁 supabase/                     # Schémas SQL Supabase
│   ├── 📄 schema.sql               # Schéma de base (messages, stats)
│   ├── 📄 schema_gamification.sql  # Schéma gamification (XP, levels)
│   ├── 📄 schema_premium.sql       # Schéma premium (abonnements)
│   ├── 📄 schema_stripe.sql        # Schéma Stripe (paiements)
│   ├── 📄 schema_voice.sql         # Schéma voice analytics
│   └── 📄 schema_channel_counters.sql # Schéma channel counters
│
└── 📁 docs/                         # Documentation complète
    ├── 📄 README.md                # Index de la documentation
    │
    ├── 🚀 Guides de Démarrage
    │   ├── GUIDE_COMPLET.md        # Guide complet d'installation
    │   ├── GAMIFICATION_SETUP.md   # Configuration gamification
    │   └── NEW_FEATURES_SETUP.md   # Configuration nouvelles features
    │
    ├── 💳 Guides Stripe
    │   ├── STRIPE_SETUP.md         # Guide d'installation Stripe
    │   ├── STRIPE_CONFIG_COMPLETE.md # Configuration complète
    │   ├── STRIPE_SETUP_FINAL.md   # Guide final
    │   └── STRIPE_SETUP_GUIDE.md   # Guide rapide
    │
    ├── 💰 Monétisation
    │   ├── MONETIZATION_PLAN.md    # Plan de monétisation
    │   └── IMPLEMENTATION_GUIDE.md # Guide d'implémentation
    │
    ├── 🌐 Déploiement
    │   └── VERCEL_DEPLOY_NOW.md    # Déploiement Vercel rapide
    │
    └── 🔧 Dépannage
        ├── DISCORD_INTERACTIONS_URL.md
        ├── FIX_DISCORD_TOKEN.md
        └── TEST_DASHBOARD.md
```

## 📋 Fichiers par Catégorie

### 🤖 Bot Discord (`src/`)
- **Handlers** : Gestion des événements Discord
- **Utils** : Fonctionnalités métier (IA, analytics, premium, etc.)

### 🌐 Dashboard (`dashboard/`)
- **App** : Pages Next.js avec App Router
- **Config** : Configuration Next.js, Tailwind, TypeScript

### 🗄️ Base de Données (`supabase/`)
- **Schémas SQL** : Un fichier par fonctionnalité

### 📚 Documentation (`docs/`)
- **Guides** : Documentation complète organisée par thème
- **README.md** : Index de la documentation

## 🎯 Fichiers Importants

### Configuration
- `package.json` - Dépendances du bot
- `render.yaml` - Configuration Render
- `.gitignore` - Fichiers ignorés

### Documentation Principale
- `README.md` - Documentation principale (racine)
- `docs/README.md` - Index de la documentation
- `docs/GUIDE_COMPLET.md` - Guide complet d'installation

### Déploiement
- `dashboard/VERCEL_DEPLOY.md` - Déploiement dashboard
- `render.yaml` - Configuration Render bot

---

**Structure organisée et prête pour la production ! 🚀**

