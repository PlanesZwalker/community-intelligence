# 🤖 Community Intelligence Bot

Bot Discord d'analyse de communauté avec IA générative - Solution complète pour analyser, comprendre et améliorer votre communauté Discord.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités Complètes](#fonctionnalités-complètes)
- [Commandes Discord](#commandes-discord)
- [Architecture Technique](#architecture-technique)
- [Installation et Configuration](#installation-et-configuration)
- [Déploiement](#déploiement)
- [Système de Monétisation](#système-de-monétisation)
- [Dashboard Web](#dashboard-web)
- [Conformité et Sécurité](#conformité-et-sécurité)
- [Documentation](#documentation)

## Vue d'ensemble

Community Intelligence Bot est une solution complète d'analyse et d'intelligence pour les communautés Discord. Le bot collecte automatiquement les données de votre serveur, les analyse avec des algorithmes avancés et de l'IA générative, et fournit des insights actionnables pour améliorer l'engagement et la croissance de votre communauté.

### Caractéristiques Principales

- **Collecte Automatique** : Enregistrement automatique de tous les messages, réactions, et interactions
- **Analyse en Temps Réel** : Statistiques et métriques mises à jour en continu
- **IA Générative** : Résumés intelligents, recommandations, et prédictions avec Groq (gratuit)
- **Gamification Complète** : Système XP/Levels avec leaderboard pour augmenter l'engagement jusqu'à 4x
- **Détection Anti-Spam** : Score de confiance et détection automatique des bots et spam
- **Analytics Avancés** : Prédictions, tendances, et insights proactifs
- **Monétisation Intégrée** : Système de plans premium avec Stripe

## Fonctionnalités Complètes

### 📊 Statistiques et Analytics

#### Collecte de Données
- **Collecte Automatique** : Tous les messages sont automatiquement stockés dans Supabase
- **Synchronisation Historique** : Récupération des messages passés avec `/ci-sync-history`
- **Métadonnées Complètes** : Auteur, canal, date, réactions, mentions, questions détectées
- **Détection de Questions** : Identification automatique des questions posées dans les messages

#### Statistiques en Temps Réel
- **Messages Totaux** : Comptage de tous les messages par période
- **Membres Actifs** : Identification des membres les plus engagés
- **Canaux Populaires** : Analyse de l'activité par canal
- **Taux d'Engagement** : Calcul du taux de réponse aux questions
- **Heures de Pic** : Identification des moments les plus actifs
- **Graphiques Temporels** : Visualisation de l'activité dans le temps

#### Analytics Avancés
- **Top Membres** : Classement des membres les plus actifs
- **Top Canaux** : Identification des canaux les plus populaires
- **Tendances** : Analyse des tendances d'activité
- **Métriques d'Engagement** : Taux de réaction, interactions, croissance
- **Export de Données** : Export CSV des statistiques (premium)

### 🤖 Intelligence Artificielle Générative

#### Résumés Intelligents
- **Résumé IA** : Génération automatique de résumés avec `/ci-ai-summary`
- **Chunking Intelligent** : Traitement de milliers de messages avec découpage automatique
- **Résumé Récursif** : Résumés de résumés pour gérer de très grands volumes
- **Modèles Groq** : Utilisation de modèles gratuits (llama-3.1-8b-instant, llama-3.3-70b-versatile)
- **Fallback Automatique** : Bascule automatique vers d'autres modèles en cas d'erreur

#### Analyse de Sentiment
- **Détection de Sentiment** : Analyse positive/neutre/négative avec `/ci-sentiment`
- **Analyse par Canal** : Sentiment spécifique à chaque canal
- **Analyse Globale** : Sentiment général du serveur sur une période
- **Tendances de Sentiment** : Évolution du sentiment dans le temps

#### Recommandations et Prédictions
- **Recommandations Personnalisées** : Suggestions d'engagement avec `/ci-recommendations`
- **Prédictions Proactives** : Alertes pour les 7 prochains jours avec `/ci-predictions`
- **Détection de Problèmes** : Identification des questions non résolues
- **Alertes Automatiques** : Notifications pour VIP inactifs, chutes d'activité

#### Quêtes Personnalisées
- **Génération par IA** : Quêtes quotidiennes générées avec `/ci-quest`
- **Personnalisation** : Adaptation selon le rôle et l'activité du membre
- **Types de Quêtes** : Engagement, découverte, sociales, créatives, modération
- **Récompenses XP** : Attribution automatique de points pour les quêtes complétées

### 🏆 Système de Gamification

#### Points d'Expérience (XP)
- **Attribution Automatique** : XP gagné par message envoyé
- **Cooldown Intelligent** : Système de cooldown pour éviter le spam
- **XP Bonus** : Points supplémentaires pour réactions et interactions
- **Formule Équilibrée** : Calcul des niveaux avec progression équilibrée

#### Niveaux et Leaderboard
- **Système de Niveaux** : Progression de niveau basée sur l'XP total
- **Leaderboard en Temps Réel** : Classement des membres les plus actifs
- **Rang Utilisateur** : Position dans le classement du serveur
- **Progression Visible** : Affichage de la progression vers le niveau suivant

#### Récompenses Automatiques
- **Attribution de Rôles** : Rôles automatiques basés sur le niveau XP
- **Configuration Flexible** : Définition des niveaux et rôles associés
- **Badges Visuels** : Système d'achievements avec badges débloquables
- **Statistiques de Progression** : Suivi détaillé de la progression de chaque membre

### 🛡️ Détection Anti-Spam et Sécurité

#### Score de Confiance
- **Score 0-100** : Évaluation de la confiance de chaque membre avec `/ci-trust-score`
- **Calcul Multi-Critères** : Analyse basée sur plusieurs facteurs
- **Historique** : Suivi de l'évolution du score dans le temps

#### Détection de Bots et Spam
- **Analyse Multi-Critères** : Détection avec `/ci-bot-detection`
  - Comptes créés récemment (< 7 jours)
  - Absence d'avatar personnalisé
  - Messages répétitifs ou identiques
  - Liens suspects ou URLs raccourcies
  - Fréquence de messages anormale
  - Patterns de spam connus
- **Analyse par Canal** : Contexte spécifique à chaque canal
- **Détection de Pics** : Identification des pics d'activité suspects
- **Alertes Automatiques** : Notifications pour les comptes suspects

### 📊 Channel Counters

#### Compteurs Visuels
- **Mise à Jour Dynamique** : Noms de canaux mis à jour automatiquement
- **Types de Compteurs** : Membres, messages, en ligne, messages aujourd'hui
- **Gestion Flexible** : Création et suppression avec `/ci-counter`
- **Mise à Jour Périodique** : Actualisation automatique toutes les 5 minutes

### 🎤 Voice Analytics

#### Tracking Vocal
- **Sessions Vocales** : Enregistrement automatique des sessions
- **Durée Totale** : Temps passé en vocal par membre
- **Canaux Populaires** : Identification des canaux vocaux les plus utilisés
- **Heures de Pic** : Moments les plus actifs en vocal
- **Statistiques Détaillées** : Rapport complet avec `/ci-voice-stats`

### 📊 Mod Performance Tracking

#### Suivi des Modérateurs
- **Métriques de Performance** : Activité, réactivité, engagement
- **Rapport Détaillé** : Analyse complète avec `/ci-mod-report`
- **Comparaison** : Benchmarking entre modérateurs
- **Recommandations** : Suggestions d'amélioration

### 👋 Onboarding Intelligent

#### Accueil Automatique
- **Analyse des Intérêts** : Détection des centres d'intérêt du nouveau membre
- **Messages de Bienvenue** : Accueil personnalisé avec suggestions
- **Recommandations de Canaux** : Suggestions de canaux pertinents
- **Recommandations de Rôles** : Suggestions de rôles adaptés

### 🏆 Badges et Achievements

#### Système de Badges
- **Badges Débloquables** : Achievements visuels avec `/ci-badges`
- **Conditions Variées** : Déblocage basé sur différents critères
- **Affichage Public** : Badges visibles dans le profil
- **Collection Complète** : Suivi de tous les badges disponibles

## Commandes Discord

### Commandes de Statistiques

#### `/ci-stats`
- **Description** : Affiche les statistiques complètes du serveur en temps réel
- **Données Affichées** :
  - Messages totaux
  - Membres actifs
  - Canaux actifs
  - Questions posées
  - Taux de réponse
  - Messages populaires
- **Disponibilité** : Tous les plans

#### `/ci-weekly-summary`
- **Description** : Génère un résumé hebdomadaire automatique de l'activité
- **Contenu** :
  - Top 3 membres actifs
  - Canaux les plus actifs
  - Questions sans réponse
  - Résumé IA (si configuré)
- **Disponibilité** : Tous les plans

#### `/ci-sync-history`
- **Description** : Synchronise l'historique des messages depuis Discord vers la base de données
- **Fonctionnement** :
  - Récupère jusqu'à 100 messages par canal
  - Traite jusqu'à 50 canaux par serveur
  - Vérification automatique des doublons
- **Disponibilité** : Tous les plans

### Commandes IA et Intelligence

#### `/ci-ai-summary`
- **Description** : Résumé intelligent généré par IA avec chunking automatique
- **Fonctionnalités** :
  - Traitement de milliers de messages
  - Découpage intelligent en chunks
  - Résumé récursif pour très grands volumes
  - Utilisation de modèles Groq gratuits
- **Limites** : Premium uniquement (limité sur Gratuit)
- **Disponibilité** : Pro, Business, Enterprise

#### `/ci-recommendations`
- **Description** : Recommandations d'engagement personnalisées basées sur l'analyse IA
- **Contenu** :
  - Suggestions d'amélioration de l'engagement
  - Identification des opportunités
  - Recommandations actionnables
- **Disponibilité** : Tous les plans (limité sur Gratuit)

#### `/ci-sentiment`
- **Description** : Analyse de sentiment des messages (positif/neutre/négatif)
- **Options** :
  - Analyse par canal spécifique
  - Analyse globale du serveur
  - Période personnalisable
- **Disponibilité** : Pro, Business, Enterprise

#### `/ci-predictions`
- **Description** : Prédictions et alertes proactives pour les 7 prochains jours
- **Contenu** :
  - Tendances d'activité prévues
  - Alertes pour VIP inactifs
  - Détection de chutes d'activité
  - Recommandations proactives
- **Disponibilité** : Pro, Business, Enterprise

#### `/ci-quest`
- **Description** : Quêtes personnalisées quotidiennes générées par IA pour chaque membre
- **Types de Quêtes** :
  - Engagement (messages, réactions)
  - Découverte (explorer canaux)
  - Sociales (aider membres)
  - Créatives (partager contenu)
  - Modération (signaler spam)
- **Récompenses** : XP pour chaque quête complétée
- **Disponibilité** : Pro, Business, Enterprise

### Commandes de Gamification

#### `/ci-xp`
- **Description** : Affiche votre niveau XP, progression et le leaderboard du serveur
- **Informations Affichées** :
  - Niveau actuel
  - XP total
  - XP nécessaire pour le niveau suivant
  - Rang dans le serveur
  - Top 10 du leaderboard
- **Disponibilité** : Tous les plans

#### `/ci-badges`
- **Description** : Affiche tous vos badges débloqués et achievements disponibles
- **Contenu** :
  - Liste des badges obtenus
  - Badges disponibles à débloquer
  - Conditions de déblocage
- **Disponibilité** : Tous les plans

### Commandes de Sécurité

#### `/ci-bot-detection`
- **Description** : Analyse complète des bots et spam dans le serveur
- **Critères Analysés** :
  - Comptes récents
  - Absence d'avatar
  - Messages répétitifs
  - Liens suspects
  - Fréquence anormale
  - Patterns de spam
- **Résultats** : Liste des comptes suspects avec scores
- **Disponibilité** : Tous les plans

#### `/ci-trust-score`
- **Description** : Score de confiance (0-100) d'un membre spécifique
- **Paramètres** : Mention ou ID du membre
- **Calcul** : Basé sur plusieurs critères de confiance
- **Disponibilité** : Tous les plans

### Commandes de Fonctionnalités Avancées

#### `/ci-counter`
- **Description** : Gère les compteurs visuels dans les canaux
- **Actions** :
  - Créer un compteur (membres, messages, en ligne, messages aujourd'hui)
  - Supprimer un compteur
  - Lister tous les compteurs
- **Mise à Jour** : Automatique toutes les 5 minutes
- **Disponibilité** : Pro, Business, Enterprise

#### `/ci-voice-stats`
- **Description** : Statistiques complètes de l'activité vocale (temps, canaux, membres)
- **Métriques** :
  - Temps total passé en vocal
  - Nombre de sessions
  - Membres actifs en vocal
  - Canaux vocaux les plus utilisés
  - Heures de pic
  - Durée moyenne des sessions
- **Disponibilité** : Pro, Business, Enterprise

#### `/ci-mod-report`
- **Description** : Rapport de performance des modérateurs avec métriques détaillées
- **Métriques** :
  - Activité des modérateurs
  - Réactivité aux problèmes
  - Engagement avec la communauté
  - Comparaison entre modérateurs
- **Disponibilité** : Business, Enterprise

### Commandes Premium

#### `/ci-upgrade`
- **Description** : Passer à un plan premium (Stripe)
- **Plans Disponibles** :
  - Pro (25€/mois)
  - Business (75€/mois)
  - Enterprise (250€/mois)
- **Fonctionnement** : Crée une session Stripe Checkout
- **Disponibilité** : Tous les plans

#### `/ci-billing`
- **Description** : Gérer votre abonnement et factures via le portail Stripe
- **Fonctionnalités** :
  - Voir les factures
  - Modifier le plan
  - Annuler l'abonnement
  - Mettre à jour le moyen de paiement
- **Disponibilité** : Utilisateurs premium uniquement

#### `/ci-plan`
- **Description** : Affiche votre plan actuel et les fonctionnalités disponibles
- **Informations** :
  - Plan actuel (Free, Pro, Business, Enterprise)
  - Statut de l'abonnement
  - Fonctionnalités incluses
  - Date de renouvellement
- **Disponibilité** : Tous les plans

#### `/ci-help`
- **Description** : Affiche toutes les commandes disponibles organisées par catégories
- **Catégories** :
  - Statistiques & Analytics
  - IA & Intelligence
  - Gamification
  - Sécurité & Modération
  - Fonctionnalités Avancées
  - Premium & Abonnement
- **Disponibilité** : Tous les plans

## Architecture Technique

### Structure du Projet

```
community-intelligence/
├── src/                          # Code source du bot Discord
│   ├── index.js                  # Point d'entrée principal
│   ├── handlers/                 # Gestionnaires d'événements
│   │   ├── commandHandler.js     # Gestion des commandes slash (20 commandes)
│   │   └── messageHandler.js     # Gestion des messages et collecte
│   └── utils/                    # Utilitaires et services
│       ├── aiService.js          # Service IA (Groq, OpenAI, etc.)
│       ├── analytics.js          # Analytics de base
│       ├── badges.js             # Système de badges
│       ├── botDetection.js       # Détection bots/spam
│       ├── channelCounters.js    # Compteurs de canaux
│       ├── chunkedSummary.js     # Résumé IA avec chunking
│       ├── onboarding.js         # Onboarding intelligent
│       ├── predictions.js        # Prédictions et alertes
│       ├── premium.js            # Gestion plans premium
│       ├── questSystem.js        # Système de quêtes
│       ├── registerCommands.js   # Enregistrement commandes Discord
│       ├── sentimentAnalysis.js  # Analyse de sentiment
│       ├── stripe.js            # Intégration Stripe
│       ├── syncHistory.js       # Synchronisation historique
│       ├── voiceAnalytics.js    # Analytics vocales
│       ├── weeklySummary.js     # Résumé hebdomadaire
│       ├── xpRewards.js         # Récompenses XP
│       └── xpSystem.js           # Système XP/Levels
├── dashboard/                    # Dashboard web Next.js
│   ├── app/                      # Pages Next.js (App Router)
│   │   ├── dashboard/           # Dashboard utilisateur
│   │   ├── landing/             # Landing page publique
│   │   ├── privacy/             # Politique de confidentialité RGPD
│   │   ├── terms/               # Conditions d'utilisation
│   │   ├── cgv/                 # Conditions générales de vente
│   │   └── api/                 # API routes
│   │       └── stripe/          # Routes Stripe (checkout, billing)
│   └── ...
├── supabase/                     # Schémas SQL Supabase
│   ├── schema.sql               # Schéma de base
│   ├── schema_gamification.sql  # Schéma gamification
│   ├── schema_premium.sql      # Schéma premium
│   ├── schema_stripe.sql       # Schéma Stripe
│   ├── schema_voice.sql        # Schéma voice analytics
│   └── schema_channel_counters.sql # Schéma channel counters
└── docs/                         # Documentation complète
```

### Base de Données

#### Tables Principales

**messages**
- Stockage de tous les messages Discord
- Champs : id, guild_id, channel_id, author_id, content, created_at, reaction_count, is_question
- Index sur guild_id, channel_id, author_id pour performances

**guild_stats**
- Statistiques agrégées par serveur
- Champs : guild_id, total_messages, active_members, active_channels, last_updated
- Mise à jour périodique automatique

**guild_config**
- Configuration par serveur
- Champs : guild_id, config_key, config_value
- Configuration flexible et extensible

**user_xp**
- Système de gamification
- Champs : user_id, guild_id, xp, level, last_message_at
- Calcul automatique des niveaux

**guild_subscriptions**
- Abonnements premium Stripe
- Champs : guild_id, stripe_customer_id, plan_type, status, current_period_end
- Synchronisation avec Stripe via webhooks

**voice_sessions**
- Sessions vocales
- Champs : user_id, guild_id, channel_id, start_time, end_time, duration
- Tracking automatique des entrées/sorties

**channel_counters**
- Configuration des compteurs
- Champs : guild_id, channel_id, counter_type, enabled
- Mise à jour automatique des noms de canaux

### Intégrations

#### Discord.js
- **Version** : Latest
- **Intents Requis** : MESSAGE_CONTENT_INTENT, SERVER_MEMBERS_INTENT, GUILD_VOICE_STATES
- **Événements Gérés** : MessageCreate, InteractionCreate, VoiceStateUpdate, GuildMemberAdd

#### Supabase
- **Type** : PostgreSQL
- **Authentification** : OAuth2 Discord pour le dashboard
- **Stockage** : Données structurées avec relations
- **API** : REST et Realtime

#### Groq API
- **Provider IA Principal** : Gratuit, 14,400 requêtes/jour
- **Modèles** : llama-3.1-8b-instant, llama-3.3-70b-versatile, openai/gpt-oss-20b
- **Fallback** : Système de fallback automatique vers autres modèles

#### Stripe
- **Intégration** : Checkout Sessions, Billing Portal, Webhooks
- **Paiements** : Abonnements mensuels récurrents
- **Sécurité** : PCI-DSS niveau 1, données bancaires non stockées

## Installation et Configuration

### Prérequis

- **Node.js** : Version 18.17.0 ou supérieure
- **Compte Discord Developer** : Pour créer le bot
- **Compte Supabase** : Base de données gratuite
- **Compte Groq** (optionnel) : Pour fonctionnalités IA gratuites
- **Compte Stripe** (optionnel) : Pour monétisation

### Configuration Discord

1. Créer une application sur https://discord.com/developers/applications
2. Créer un bot et copier le token
3. Activer les intents requis :
   - MESSAGE CONTENT INTENT
   - SERVER MEMBERS INTENT
   - GUILD VOICE STATES (pour voice analytics)
4. Configurer OAuth2 pour le dashboard :
   - Scopes : `bot`, `applications.commands`
   - Permissions : Read Messages, Send Messages, Read Message History
   - Redirect URI : `https://[votre-projet].supabase.co/auth/v1/callback`

### Configuration Supabase

#### Schémas SQL Requis

1. **Schéma de Base** (`supabase/schema.sql`)
   - Tables : messages, guild_stats, guild_config
   - Index et contraintes

2. **Schéma Gamification** (`supabase/schema_gamification.sql`)
   - Tables : user_xp, xp_rewards, user_badges
   - Triggers pour calcul automatique des niveaux

3. **Schéma Premium** (`supabase/schema_premium.sql`)
   - Tables : subscriptions, usage_limits
   - Gestion des limites par plan

4. **Schéma Stripe** (`supabase/schema_stripe.sql`)
   - Table : guild_subscriptions
   - Synchronisation avec Stripe

5. **Schéma Voice** (`supabase/schema_voice.sql`)
   - Table : voice_sessions
   - Tracking des sessions vocales

6. **Schéma Channel Counters** (`supabase/schema_channel_counters.sql`)
   - Table : channel_counters
   - Configuration des compteurs

#### Configuration Auth Discord

1. Aller dans Supabase > Authentication > Providers
2. Activer Discord
3. Configurer :
   - Client ID : ID de votre application Discord
   - Client Secret : Secret de votre application Discord
   - Redirect URL : `https://[votre-projet].supabase.co/auth/v1/callback`

### Variables d'Environnement

#### Bot Discord (Render)

```env
# Discord
DISCORD_TOKEN=votre_token_discord
DISCORD_CLIENT_ID=votre_client_id_discord

# Supabase
SUPABASE_URL=https://[projet].supabase.co
SUPABASE_KEY=votre_cle_anon_public

# IA (Optionnel)
AI_PROVIDER=groq
GROQ_API_KEY=votre_cle_groq

# Stripe (Optionnel - pour monétisation)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Options
NODE_ENV=production
SYNC_HISTORY_ON_START=false
```

#### Dashboard Web (Vercel)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[projet].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_public
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role

# Stripe (Optionnel)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SITE_URL=https://votre-site.vercel.app

# Discord (pour OAuth)
NEXT_PUBLIC_DISCORD_CLIENT_ID=votre_client_id_discord
DISCORD_CLIENT_SECRET=votre_client_secret_discord
```

## Déploiement

### Bot Discord sur Render

1. Créer un compte sur https://render.com
2. Créer un nouveau Web Service
3. Connecter le repository GitHub
4. Configuration :
   - **Build Command** : `npm install`
   - **Start Command** : `node src/index.js`
   - **Plan** : Free (gratuit)
5. Ajouter les variables d'environnement
6. Déployer

### Dashboard Web sur Vercel

1. Créer un compte sur https://vercel.com
2. Importer le repository GitHub
3. Configuration :
   - **Root Directory** : `dashboard`
   - **Framework Preset** : Next.js
4. Ajouter les variables d'environnement
5. Déployer

📖 **Guides détaillés** :
- [dashboard/VERCEL_DEPLOY.md](./dashboard/VERCEL_DEPLOY.md) - Déploiement dashboard
- [docs/VERCEL_DEPLOY_NOW.md](./docs/VERCEL_DEPLOY_NOW.md) - Guide rapide

## Système de Monétisation

### Plans Disponibles

#### 🆓 Plan Gratuit
- **Prix** : 0€/mois
- **Limites** :
  - 1 serveur
  - 10,000 messages/mois
  - 10 canaux maximum
- **Fonctionnalités** :
  - Statistiques basiques
  - Gamification limitée
  - Détection spam basique
  - Dashboard web
- **Restrictions** :
  - Pas d'IA générative
  - Pas d'export de données
  - Pas de fonctionnalités avancées

#### 💎 Plan Pro
- **Prix** : 25€/mois
- **Limites** :
  - 5 serveurs
  - Messages illimités
  - Canaux illimités
- **Fonctionnalités** :
  - Toutes les fonctionnalités Gratuit +
  - Résumés IA avec Groq
  - Analyse de sentiment
  - Prédictions et alertes
  - Channel counters
  - Voice analytics
  - Quêtes personnalisées
  - Export CSV
- **Disponibilité** : Disponible maintenant

#### 🚀 Plan Business
- **Prix** : 75€/mois
- **Limites** :
  - Serveurs illimités
  - Messages illimités
  - Canaux illimités
- **Fonctionnalités** :
  - Toutes les fonctionnalités Pro +
  - Mod performance tracking
  - Benchmarking
  - Webhooks
  - API REST
  - Discord SEO
  - Support prioritaire
- **Disponibilité** : Disponible maintenant

#### 🏢 Plan Enterprise
- **Prix** : 250€/mois (sur devis)
- **Limites** :
  - Serveurs illimités
  - Messages illimités
  - Canaux illimités
- **Fonctionnalités** :
  - Toutes les fonctionnalités Business +
  - AI chatbot custom
  - White-label
  - Onboarding dédié
  - SLA 99.9%
  - Success manager
- **Disponibilité** : Sur demande

### Intégration Stripe

#### Configuration Stripe

1. Créer un compte sur https://stripe.com
2. Obtenir les clés API (test ou production)
3. Configurer les produits et prix :
   - Pro : 25€/mois
   - Business : 75€/mois
   - Enterprise : 250€/mois
4. Configurer le webhook :
   - URL : `https://[votre-bot].onrender.com/webhook/stripe`
   - Événements : checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
   - Secret : Copier le secret du webhook

#### Webhooks Stripe

Le bot gère automatiquement :
- **checkout.session.completed** : Activation de l'abonnement après paiement
- **customer.subscription.updated** : Mise à jour du plan ou statut
- **customer.subscription.deleted** : Annulation de l'abonnement

#### Portail de Facturation

Les utilisateurs peuvent accéder au portail Stripe via `/ci-billing` pour :
- Voir les factures
- Modifier le plan
- Annuler l'abonnement
- Mettre à jour le moyen de paiement

📖 **Documentation complète** :
- [docs/STRIPE_CONFIG_COMPLETE.md](./docs/STRIPE_CONFIG_COMPLETE.md) - Configuration Stripe
- [docs/MONETIZATION_PLAN.md](./docs/MONETIZATION_PLAN.md) - Plan de monétisation

## Dashboard Web

### Fonctionnalités

#### Authentification
- **OAuth2 Discord** : Connexion sécurisée avec Discord
- **Session Management** : Gestion automatique des sessions
- **Multi-Serveurs** : Accès à tous les serveurs où le bot est actif

#### Visualisation des Données
- **Statistiques en Temps Réel** : Métriques mises à jour automatiquement
- **Graphiques Interactifs** : Graphiques d'activité avec Recharts
- **Top Membres** : Classement des membres les plus actifs
- **Filtres Temporels** : 7 jours, 30 jours, 90 jours, tout
- **Export CSV** : Téléchargement des données

#### Fonctionnalités Premium
- **Affichage du Plan** : Plan actuel et fonctionnalités disponibles
- **Upgrade Direct** : Bouton pour passer à un plan premium
- **Portail de Facturation** : Accès au portail Stripe

### Pages Disponibles

- **/** : Page de connexion
- **/dashboard** : Dashboard principal avec statistiques
- **/landing** : Landing page publique avec fonctionnalités et pricing
- **/privacy** : Politique de confidentialité RGPD
- **/terms** : Conditions d'utilisation
- **/cgv** : Conditions générales de vente

### Technologies

- **Next.js 14** : Framework React avec App Router
- **TypeScript** : Typage statique
- **Tailwind CSS** : Styling utility-first
- **Recharts** : Bibliothèque de graphiques
- **Lucide React** : Icônes
- **Supabase Auth** : Authentification Discord OAuth2

## Conformité et Sécurité

### RGPD

Le service est conforme au Règlement Général sur la Protection des Données (RGPD) :

- **Politique de Confidentialité** : Disponible sur `/privacy`
- **Conditions d'Utilisation** : Disponible sur `/terms`
- **CGV** : Disponible sur `/cgv`
- **Droits des Utilisateurs** : Accès, rectification, effacement, portabilité
- **Consentement** : Information claire avant collecte de données
- **Sécurité** : Chiffrement des données en transit et au repos

### Sécurité des Données

- **Chiffrement** : HTTPS/TLS pour toutes les communications
- **Base de Données** : Chiffrement au repos dans Supabase
- **Paiements** : Stripe PCI-DSS niveau 1, aucune donnée bancaire stockée
- **Authentification** : OAuth2 sécurisé pour Discord
- **Accès** : Principe du moindre privilège

### Hébergement

- **Bot** : Render (conforme RGPD)
- **Dashboard** : Vercel (conforme RGPD, SOC 2 Type II)
- **Base de Données** : Supabase (conforme RGPD, SOC 2 Type II)
- **Paiements** : Stripe (PCI-DSS niveau 1)

## Documentation

### Guides Disponibles

- **[docs/GUIDE_COMPLET.md](./docs/GUIDE_COMPLET.md)** : Guide complet d'installation et configuration
- **[docs/GAMIFICATION_SETUP.md](./docs/GAMIFICATION_SETUP.md)** : Configuration du système de gamification
- **[docs/NEW_FEATURES_SETUP.md](./docs/NEW_FEATURES_SETUP.md)** : Configuration des nouvelles fonctionnalités
- **[docs/STRIPE_CONFIG_COMPLETE.md](./docs/STRIPE_CONFIG_COMPLETE.md)** : Configuration complète Stripe
- **[docs/MONETIZATION_PLAN.md](./docs/MONETIZATION_PLAN.md)** : Plan de monétisation détaillé
- **[docs/IMPLEMENTATION_GUIDE.md](./docs/IMPLEMENTATION_GUIDE.md)** : Guide d'implémentation premium
- **[docs/SCALABILITY_GUIDE.md](./docs/SCALABILITY_GUIDE.md)** : Guide complet de scalabilité et migration infrastructure
- **[dashboard/VERCEL_DEPLOY.md](./dashboard/VERCEL_DEPLOY.md)** : Déploiement dashboard Vercel
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** : Structure complète du projet

### Schémas SQL

Tous les schémas SQL sont disponibles dans `supabase/` :
- `schema.sql` : Schéma de base
- `schema_gamification.sql` : Gamification
- `schema_premium.sql` : Premium
- `schema_stripe.sql` : Stripe
- `schema_voice.sql` : Voice analytics
- `schema_channel_counters.sql` : Channel counters

## Stack Technique

### Bot Discord
- **Runtime** : Node.js 18+
- **Framework** : discord.js (latest)
- **Base de Données** : Supabase (PostgreSQL)
- **IA** : Groq API (gratuit), OpenAI, Anthropic Claude
- **Paiements** : Stripe
- **Hébergement** : Render (gratuit)

### Dashboard Web
- **Framework** : Next.js 14 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **Graphiques** : Recharts
- **Authentification** : Supabase Auth (Discord OAuth2)
- **Hébergement** : Vercel (gratuit)

### Infrastructure
- **Base de Données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **Paiements** : Stripe
- **CDN** : Vercel Edge Network
- **Monitoring** : Render logs, Vercel analytics

## Commandes Complètes par Catégorie

### 📊 Statistiques & Analytics
- `/ci-stats` - Statistiques complètes du serveur
- `/ci-weekly-summary` - Résumé hebdomadaire automatique
- `/ci-sync-history` - Synchroniser l'historique des messages

### 🤖 IA & Intelligence
- `/ci-ai-summary` - Résumé intelligent généré par IA
- `/ci-recommendations` - Recommandations d'engagement personnalisées
- `/ci-sentiment` - Analyse de sentiment des messages
- `/ci-predictions` - Prédictions et alertes proactives
- `/ci-quest` - Quêtes personnalisées générées par IA

### 🏆 Gamification
- `/ci-xp` - Voir votre niveau XP et le leaderboard
- `/ci-badges` - Voir vos badges et achievements

### 🛡️ Sécurité & Modération
- `/ci-bot-detection` - Détecter les bots et spam
- `/ci-trust-score` - Score de confiance d'un membre

### 📊 Fonctionnalités Avancées
- `/ci-counter` - Gérer les compteurs de canaux
- `/ci-voice-stats` - Statistiques de l'activité vocale
- `/ci-mod-report` - Rapport de performance des modérateurs

### 💳 Premium & Abonnement
- `/ci-upgrade` - Passer à un plan premium
- `/ci-billing` - Gérer votre abonnement
- `/ci-plan` - Voir votre plan actuel
- `/ci-help` - Afficher toutes les commandes disponibles

## Limitations et Notes

### Limitations Techniques

- **Synchronisation Historique** : Maximum 100 messages par canal, 50 canaux par serveur
- **Propagation des Commandes** : Jusqu'à 1 heure pour les commandes globales Discord
- **Groq API** : 14,400 requêtes/jour en plan gratuit
- **Render Free** : Service peut s'endormir après inactivité

### Notes Importantes

- Le bot collecte uniquement les messages **après** son activation par défaut
- Utilisez `/ci-sync-history` pour récupérer l'historique
- Les données sont stockées de manière sécurisée sur Supabase
- Conforme aux règles de Discord (Message Content Intent requis)
- Les commandes peuvent être utilisées même si elles n'apparaissent pas dans l'autocomplétion

## Support et Contribution

### Support

- **Documentation** : Voir le dossier `docs/` pour guides détaillés
- **Issues** : Ouvrir une issue sur GitHub pour signaler un problème
- **Support** : [Serveur Discord de support](https://discord.gg/community-intelligence) (pour questions premium et assistance)

### Contribution

Les contributions sont les bienvenues ! Veuillez :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence [MIT](LICENSE).

---

**Community Intelligence Bot** - Analysez et développez votre communauté Discord avec l'IA 🚀
