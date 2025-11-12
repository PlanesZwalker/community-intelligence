'use client'

import { useState } from 'react'
import Link from 'next/link'
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
  Bot
} from 'lucide-react'

export default function LandingPage() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  const features = [
    {
      icon: Brain,
      title: 'IA Générative',
      description: 'Résumés intelligents et recommandations personnalisées avec Groq (gratuit)',
    },
    {
      icon: BarChart3,
      title: 'Analytics Avancés',
      description: 'Statistiques en temps réel, prédictions et tendances pour votre communauté',
    },
    {
      icon: Shield,
      title: 'Détection Anti-Spam',
      description: 'Score de confiance et détection automatique des bots et spam',
    },
    {
      icon: Zap,
      title: 'Gamification',
      description: 'Système XP/Levels avec leaderboard pour augmenter l\'engagement (4x)',
    },
    {
      icon: Users,
      title: 'Voice Analytics',
      description: 'Tracking complet de l\'activité vocale et statistiques détaillées',
    },
    {
      icon: Target,
      title: 'Quêtes Personnalisées',
      description: 'Quêtes quotidiennes générées par IA pour chaque membre',
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
          <div className="flex gap-4 justify-center">
            <Link
              href="https://discord.com/api/oauth2/authorize?client_id=1437809276927213628&permissions=274877906944&scope=bot%20applications.commands"
              target="_blank"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold text-lg flex items-center gap-2"
            >
              Inviter le bot <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-semibold text-lg"
            >
              Voir le dashboard
            </Link>
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
              key={index}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <feature.icon className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
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
              <Link
                href={plan.name === 'Enterprise' ? 'mailto:support@example.com' : '/dashboard'}
                className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {plan.cta}
              </Link>
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
      <footer className="border-t border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2024 Community Intelligence. Tous droits réservés.</p>
          <div className="mt-4 flex justify-center gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">
              Conditions d'utilisation
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="https://github.com/PlanesZwalker/community-intelligence" target="_blank" className="hover:text-white transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

