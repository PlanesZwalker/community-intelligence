'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  BarChart3, 
  Brain, 
  Shield, 
  Zap, 
  Users, 
  TrendingUp, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  MessageSquare,
  Bot,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles as SparklesIcon,
  Mic,
  Trophy,
  AlertTriangle
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  const features = [
    {
      id: 'ai',
      icon: Brain,
      title: 'IA Générative',
      description: 'Résumés intelligents et recommandations personnalisées avec Groq (gratuit)',
      details: {
        overview: 'Notre système d\'IA générative utilise Groq (gratuit) pour analyser et comprendre votre communauté Discord.',
        features: [
          'Résumés intelligents avec chunking automatique pour analyser des milliers de messages',
          'Recommandations personnalisées basées sur l\'analyse des tendances',
          'Détection automatique des questions non résolues',
          'Analyse de sentiment en temps réel (positif/neutre/négatif)',
          'Prédictions proactives sur l\'évolution de votre communauté',
          'Quêtes personnalisées générées par IA pour chaque membre',
        ],
        commands: [
          '/ci-ai-summary - Résumé intelligent de votre communauté',
          '/ci-recommendations - Recommandations d\'engagement personnalisées',
          '/ci-sentiment - Analyse de sentiment des messages (positif/neutre/négatif)',
          '/ci-predictions - Prédictions et alertes proactives pour les 7 prochains jours',
          '/ci-quest - Quêtes personnalisées générées par IA pour chaque membre',
        ],
        benefits: [
          'Gratuit avec Groq (14,400 requêtes/jour)',
          'Traitement intelligent de grandes quantités de messages',
          'Insights actionnables pour améliorer l\'engagement',
          'Détection proactive des problèmes',
        ],
        plan: 'Disponible sur tous les plans (limité sur Gratuit)',
      },
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Analytics Avancés',
      description: 'Statistiques en temps réel, prédictions et tendances pour votre communauté',
      details: {
        overview: 'Des analytics complets et en temps réel pour comprendre et optimiser votre communauté Discord.',
        features: [
          'Statistiques en temps réel : messages, membres actifs, canaux populaires',
          'Graphiques d\'activité par jour, semaine, mois',
          'Top 10 des membres les plus actifs',
          'Analyse des heures de pic d\'activité',
          'Taux d\'engagement et métriques avancées',
          'Export des données en CSV',
          'Dashboard web interactif avec graphiques',
        ],
        commands: [
          '/ci-stats - Statistiques complètes du serveur en temps réel',
          '/ci-weekly-summary - Résumé hebdomadaire automatique avec graphiques',
          '/ci-predictions - Prédictions et tendances pour les 7 prochains jours',
          '/ci-sync-history - Synchroniser l\'historique des messages passés',
        ],
        metrics: [
          'Messages totaux et par période',
          'Membres actifs et nouveaux membres',
          'Canaux les plus populaires',
          'Questions posées et réponses',
          'Réactions et interactions',
          'Taux de croissance',
          'Heures de pic d\'activité',
        ],
        benefits: [
          'Compréhension approfondie de votre communauté',
          'Identification des tendances et patterns',
          'Optimisation de l\'engagement',
          'Données exportables pour analyses externes',
        ],
        plan: 'Disponible sur tous les plans',
      },
    },
    {
      id: 'anti-spam',
      icon: Shield,
      title: 'Détection Anti-Spam',
      description: 'Score de confiance et détection automatique des bots et spam',
      details: {
        overview: 'Système avancé de détection de spam et de bots pour protéger votre communauté.',
        features: [
          'Score de confiance de 0 à 100 pour chaque membre',
          'Détection multi-critères : comptes récents, pas d\'avatar, messages répétitifs',
          'Détection de liens suspects et patterns de spam',
          'Analyse de la fréquence des messages',
          'Détection des pics d\'activité suspects',
          'Analyse par canal pour contexte spécifique',
          'Alertes automatiques pour les comptes suspects',
        ],
        commands: [
          '/ci-bot-detection - Analyse complète des bots et spam dans le serveur',
          '/ci-trust-score - Score de confiance (0-100) d\'un membre spécifique',
        ],
        detection: [
          'Comptes créés récemment (< 7 jours)',
          'Absence d\'avatar personnalisé',
          'Messages répétitifs ou identiques',
          'Liens suspects ou URLs raccourcies',
          'Fréquence de messages anormale',
          'Patterns de spam connus',
        ],
        benefits: [
          'Protection automatique de votre communauté',
          'Réduction du spam et des bots',
          'Amélioration de la qualité des interactions',
          'Alertes proactives pour les modérateurs',
        ],
        plan: 'Disponible sur tous les plans',
      },
    },
    {
      id: 'gamification',
      icon: Zap,
      title: 'Gamification',
      description: 'Système XP/Levels avec leaderboard pour augmenter l\'engagement (4x)',
      details: {
        overview: 'Système de gamification complet pour augmenter l\'engagement de votre communauté jusqu\'à 4x.',
        features: [
          'Système XP (points d\'expérience) automatique',
          'Niveaux progressifs avec formules équilibrées',
          'Leaderboard en temps réel',
          'Attribution automatique de rôles basés sur le niveau',
          'Cooldown intelligent pour éviter le spam',
          'Badges visuels et achievements',
          'Statistiques de progression par membre',
        ],
        commands: [
          '/ci-xp - Voir votre niveau XP, progression et le leaderboard du serveur',
          '/ci-badges - Voir tous vos badges débloqués et achievements',
        ],
        mechanics: [
          'XP gagné par message (avec cooldown)',
          'XP bonus pour réactions et interactions',
          'Niveaux calculés avec formule équilibrée',
          'Rôles automatiques à certains niveaux',
          'Badges débloquables pour achievements',
        ],
        benefits: [
          'Augmentation de l\'engagement jusqu\'à 4x',
          'Rétention améliorée des membres',
          'Communauté plus active et engagée',
          'Système de récompenses automatique',
        ],
        plan: 'Disponible sur tous les plans (limité sur Gratuit)',
      },
    },
    {
      id: 'voice',
      icon: Mic,
      title: 'Voice Analytics',
      description: 'Tracking complet de l\'activité vocale et statistiques détaillées',
      details: {
        overview: 'Analytics complets pour comprendre et optimiser l\'activité vocale de votre communauté.',
        features: [
          'Tracking automatique des sessions vocales',
          'Durée totale passée en vocal par membre',
          'Canaux vocaux les plus populaires',
          'Heures de pic d\'activité vocale',
          'Membres les plus actifs en vocal',
          'Statistiques de fréquentation des canaux',
          'Graphiques d\'activité vocale dans le temps',
        ],
        commands: [
          '/ci-voice-stats - Statistiques complètes de l\'activité vocale (temps, canaux, membres)',
        ],
        metrics: [
          'Temps total passé en vocal',
          'Nombre de sessions vocales',
          'Membres actifs en vocal',
          'Canaux vocaux les plus utilisés',
          'Heures de pic d\'activité',
          'Durée moyenne des sessions',
        ],
        benefits: [
          'Compréhension de l\'engagement vocal',
          'Optimisation des canaux vocaux',
          'Identification des membres actifs',
          'Données pour améliorer l\'expérience vocale',
        ],
        plan: 'Disponible sur Pro et supérieur',
      },
    },
    {
      id: 'quests',
      icon: Target,
      title: 'Quêtes Personnalisées',
      description: 'Quêtes quotidiennes générées par IA pour chaque membre',
      details: {
        overview: 'Système de quêtes personnalisées générées par IA pour augmenter l\'engagement de chaque membre.',
        features: [
          'Quêtes quotidiennes générées par IA',
          'Personnalisation basée sur le rôle et l\'activité',
          'Quêtes adaptées aux besoins du serveur',
          'Récompenses en XP pour chaque quête complétée',
          'Suivi de progression des quêtes',
          'Variété de types de quêtes',
          'Notifications automatiques des nouvelles quêtes',
        ],
        commands: [
          '/ci-quest - Voir vos quêtes personnalisées du jour générées par IA',
        ],
        types: [
          'Quêtes d\'engagement : messages, réactions, interactions',
          'Quêtes de découverte : explorer de nouveaux canaux',
          'Quêtes sociales : aider d\'autres membres',
          'Quêtes créatives : partager du contenu',
          'Quêtes de modération : signaler du spam',
        ],
        benefits: [
          'Augmentation de l\'engagement jusqu\'à 4x',
          'Membres plus actifs et impliqués',
          'Découverte de nouveaux canaux et fonctionnalités',
          'Système de récompenses motivant',
        ],
        plan: 'Disponible sur Pro et supérieur',
      },
    },
  ]

  const plans = [
    {
      name: 'Gratuit',
      price: '0€',
      period: 'toujours',
      description: 'Parfait pour tester le bot',
      features: [
        '1 serveur',
        '10,000 messages/mois',
        'Stats basiques',
        'Gamification limitée',
        'Détection spam basique',
      ],
      cta: 'Commencer gratuitement',
      popular: false,
    },
    {
      name: 'Pro',
      price: '25€',
      period: '/mois',
      description: 'Pour les communautés actives',
      features: [
        '5 serveurs',
        'Messages illimités',
        'Sentiment analysis',
        'Prédictions & alertes',
        'Channel counters',
        'Voice analytics',
        'Quêtes personnalisées',
        'Export CSV',
      ],
      cta: 'Essayer Pro',
      popular: true,
    },
    {
      name: 'Business',
      price: '75€',
      period: '/mois',
      description: 'Pour les grandes communautés',
      features: [
        'Serveurs illimités',
        'Tout Pro +',
        'Mod performance tracking',
        'Benchmarking',
        'Webhooks',
        'API REST',
        'Discord SEO',
        'Support prioritaire',
      ],
      cta: 'Essayer Business',
      popular: false,
    },
    {
      name: 'Enterprise',
      price: '250€',
      period: '/mois',
      description: 'Solution complète sur mesure',
      features: [
        'Tout Business +',
        'AI chatbot custom',
        'White-label',
        'Onboarding dédié',
        'SLA 99.9%',
        'Success manager',
      ],
      cta: 'Contacter les ventes',
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold">Community Intelligence</span>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/dashboard" 
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="https://discord.com/api/oauth2/authorize?client_id=1437809276927213628&permissions=274877906944&scope=bot%20applications.commands"
              target="_blank"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold"
            >
              Inviter le bot
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Analysez et développez votre communauté Discord
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Bot Discord d'analyse avec IA générative. Statistiques, prédictions, gamification et bien plus encore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://discord.com/api/oauth2/authorize?client_id=1437809276927213628&permissions=274877906944&scope=bot%20applications.commands"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Bot className="w-5 h-5" />
              Inviter le bot sur Discord
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-semibold text-lg"
            >
              Voir le dashboard
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            ⚡ Invitation en 1 clic • Aucune configuration requise • Fonctionne immédiatement
          </p>
        </div>
      </section>

      {/* Quick Invite Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-blue-500/30">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">🚀 Invitez le bot en 30 secondes</h2>
            <p className="text-gray-300">Cliquez sur le bouton ci-dessous pour ajouter Community Intelligence à votre serveur Discord</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <a
              href="https://discord.com/api/oauth2/authorize?client_id=1437809276927213628&permissions=274877906944&scope=bot%20applications.commands"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all font-bold text-xl flex items-center justify-center gap-3 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105"
            >
              <Bot className="w-6 h-6" />
              Inviter Community Intelligence
              <ArrowRight className="w-6 h-6" />
            </a>
            <div className="text-sm text-gray-400 space-y-1">
              <p>✅ Aucune configuration requise</p>
              <p>✅ Commence à collecter les données immédiatement</p>
              <p>✅ Compatible avec tous les serveurs Discord</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Fonctionnalités puissantes
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`bg-gray-800 rounded-lg p-6 border-2 transition-all cursor-pointer ${
                expandedFeature === feature.id
                  ? 'border-blue-500 shadow-2xl shadow-blue-500/20'
                  : 'border-gray-700 hover:border-blue-500'
              }`}
              onClick={() => setExpandedFeature(expandedFeature === feature.id ? null : feature.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <feature.icon className="w-10 h-10 text-blue-500 flex-shrink-0" />
                {expandedFeature === feature.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              
              {expandedFeature === feature.id && feature.details && (
                <div className="mt-6 pt-6 border-t border-gray-700 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <SparklesIcon className="w-5 h-5 text-blue-400" />
                      Vue d'ensemble
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{feature.details.overview}</p>
                  </div>

                  {feature.details.features && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        Fonctionnalités
                      </h4>
                      <ul className="space-y-2">
                        {feature.details.features.map((item, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feature.details.commands && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-purple-400" />
                        Commandes Discord Disponibles
                      </h4>
                      <p className="text-gray-400 text-xs mb-3">
                        Utilisez ces commandes directement dans Discord pour accéder à cette fonctionnalité :
                      </p>
                      <div className="space-y-2">
                        {feature.details.commands.map((cmd, idx) => {
                          const [commandName, description] = cmd.split(' - ');
                          return (
                            <div key={idx} className="bg-gray-700/50 rounded-lg p-3 text-sm hover:bg-gray-700 transition-colors border border-gray-600/50">
                              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                                <code className="text-blue-400 font-mono font-semibold flex-shrink-0 bg-blue-500/10 px-2 py-1 rounded">
                                  {commandName}
                                </code>
                                <span className="text-gray-300 flex-1 text-xs sm:text-sm">{description}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 p-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-lg">
                        <p className="text-blue-300 text-xs flex items-start gap-2">
                          <span className="text-lg">💡</span>
                          <span>
                            <strong className="text-white">Astuce :</strong> Tapez <code className="bg-gray-800/50 px-1.5 py-0.5 rounded text-blue-400 font-mono text-xs">/ci-help</code> dans Discord pour voir toutes les commandes disponibles !
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {feature.details.metrics && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-yellow-400" />
                        Métriques disponibles
                      </h4>
                      <ul className="space-y-2">
                        {feature.details.metrics.map((metric, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">📊</span>
                            <span>{metric}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feature.details.detection && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Critères de détection
                      </h4>
                      <ul className="space-y-2">
                        {feature.details.detection.map((item, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-red-400 mt-1">⚠️</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feature.details.mechanics && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Mécaniques du système
                      </h4>
                      <ul className="space-y-2">
                        {feature.details.mechanics.map((item, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">⚡</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feature.details.types && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-400" />
                        Types de quêtes
                      </h4>
                      <ul className="space-y-2">
                        {feature.details.types.map((item, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-green-400 mt-1">🎯</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feature.details.benefits && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        Avantages
                      </h4>
                      <ul className="space-y-2">
                        {feature.details.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">✅</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feature.details.plan && (
                    <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-blue-200 text-sm">
                        <strong className="text-white">Disponibilité :</strong> {feature.details.plan}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">
          Plans et tarifs
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Choisissez le plan qui correspond à votre communauté
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-gray-800 rounded-lg p-6 border-2 transition-all ${
                plan.popular
                  ? 'border-blue-500 scale-105'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                  Populaire
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-400 ml-2">{plan.period}</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.name === 'Gratuit' ? (
                <Link
                  href="/dashboard"
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </Link>
              ) : plan.name === 'Enterprise' ? (
                <a
                  href="https://discord.gg/community-intelligence"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </a>
              ) : (
                <button
                  onClick={async () => {
                    setLoadingPlan(plan.name.toLowerCase())
                    // Demander le guildId à l'utilisateur
                    const guildId = prompt('Entrez l\'ID de votre serveur Discord (guild_id):\n\n💡 Pour trouver l\'ID :\n1. Activez le mode développeur dans Discord\n2. Clic droit sur votre serveur > Copier l\'ID du serveur')
                    if (!guildId) {
                      setLoadingPlan(null)
                      return
                    }

                    try {
                      const response = await fetch('/api/stripe/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          planType: plan.name.toLowerCase(),
                          guildId: guildId.trim(),
                        }),
                      })

                      const data = await response.json()
                      if (data.url) {
                        window.location.href = data.url
                      } else {
                        alert('Erreur: ' + (data.error || 'Impossible de créer la session'))
                        setLoadingPlan(null)
                      }
                    } catch (error) {
                      alert('Erreur lors de la création du lien de paiement')
                      setLoadingPlan(null)
                    }
                  }}
                  disabled={loadingPlan === plan.name.toLowerCase()}
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  } ${loadingPlan === plan.name.toLowerCase() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loadingPlan === plan.name.toLowerCase() ? 'Chargement...' : plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-12">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à transformer votre communauté ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez des centaines de serveurs qui utilisent Community Intelligence
          </p>
          <Link
            href="https://discord.com/api/oauth2/authorize?client_id=1437809276927213628&permissions=274877906944&scope=bot%20applications.commands"
            target="_blank"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Inviter le bot maintenant
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Community Intelligence Bot. Tous droits réservés.
            </div>
            <div className="flex gap-6 flex-wrap justify-center">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Politique de Confidentialité
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Conditions d'Utilisation
              </Link>
              <Link href="/cgv" className="text-gray-400 hover:text-white text-sm transition-colors">
                CGV
              </Link>
              <Link href="https://github.com/PlanesZwalker/community-intelligence" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">
                GitHub
              </Link>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-500 text-xs">
            🛡️ Conforme au RGPD • Vos données sont protégées • Collecte transparente et sécurisée
          </div>
        </div>
      </footer>
    </div>
  )
}

