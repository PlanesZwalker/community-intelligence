# 📚 Documentation Community Intelligence

Bienvenue dans la documentation complète de Community Intelligence Bot.

## 📖 Guides Principaux

### 🚀 Démarrage Rapide
- **[GUIDE_COMPLET.md](./GUIDE_COMPLET.md)** - Guide complet d'installation et configuration
- **[GAMIFICATION_SETUP.md](./GAMIFICATION_SETUP.md)** - Configuration du système de gamification
- **[NEW_FEATURES_SETUP.md](./NEW_FEATURES_SETUP.md)** - Configuration des nouvelles fonctionnalités

### 💳 Monétisation
- **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** - Guide d'installation Stripe
- **[STRIPE_CONFIG_COMPLETE.md](./STRIPE_CONFIG_COMPLETE.md)** - Configuration complète Stripe (étape par étape)
- **[STRIPE_SETUP_FINAL.md](./STRIPE_SETUP_FINAL.md)** - Guide final Stripe
- **[STRIPE_SETUP_GUIDE.md](./STRIPE_SETUP_GUIDE.md)** - Guide rapide Stripe
- **[MONETIZATION_PLAN.md](./MONETIZATION_PLAN.md)** - Plan de monétisation
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Guide d'implémentation premium

### 🌐 Déploiement
- **[VERCEL_DEPLOY_NOW.md](./VERCEL_DEPLOY_NOW.md)** - Déploiement rapide sur Vercel
- **[TEST_DASHBOARD.md](./TEST_DASHBOARD.md)** - Tests du dashboard

### 🔧 Dépannage
- **[DISCORD_INTERACTIONS_URL.md](./DISCORD_INTERACTIONS_URL.md)** - Configuration Discord Interactions
- **[FIX_DISCORD_TOKEN.md](./FIX_DISCORD_TOKEN.md)** - Correction des problèmes de token Discord

## 📁 Structure du Projet

```
community-intelligence/
├── src/                    # Code source du bot
│   ├── handlers/          # Gestionnaires d'événements
│   │   ├── commandHandler.js
│   │   └── messageHandler.js
│   ├── utils/             # Utilitaires
│   │   ├── aiService.js
│   │   ├── stripe.js
│   │   ├── premium.js
│   │   └── ...
│   └── index.js           # Point d'entrée
├── dashboard/              # Dashboard web Next.js
│   ├── app/
│   │   ├── dashboard/
│   │   ├── landing/
│   │   └── ...
│   └── ...
├── supabase/               # Schémas SQL
│   ├── schema.sql
│   ├── schema_gamification.sql
│   ├── schema_stripe.sql
│   └── ...
└── docs/                   # Documentation
    └── ...
```

## 🎯 Par Où Commencer ?

1. **Nouveau projet ?** → [GUIDE_COMPLET.md](./GUIDE_COMPLET.md)
2. **Configurer Stripe ?** → [STRIPE_CONFIG_COMPLETE.md](./STRIPE_CONFIG_COMPLETE.md)
3. **Déployer le dashboard ?** → [VERCEL_DEPLOY_NOW.md](./VERCEL_DEPLOY_NOW.md)
4. **Problème technique ?** → Consultez les guides de dépannage

---

**Besoin d'aide ?** Ouvrez une issue sur GitHub ou consultez la documentation spécifique ci-dessus.
