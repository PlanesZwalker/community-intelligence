'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { 
  LogOut, 
  MessageSquare, 
  Users, 
  Hash, 
  TrendingUp, 
  AlertCircle,
  BarChart3,
  Clock,
  Zap,
  Crown,
  Download,
  Settings,
  Home,
  Bot,
  Sparkles,
  Mic,
  Heart,
  Calendar
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const COLORS = ['#5865F2', '#57F287', '#FEE75C', '#EB459E', '#ED4245', '#99AAB5']

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [guilds, setGuilds] = useState<any[]>([])
  const [selectedGuild, setSelectedGuild] = useState<string>('')
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])
  const [topMembers, setTopMembers] = useState<any[]>([])
  const [period, setPeriod] = useState<'7' | '30' | '90' | 'all'>('7')
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'channels' | 'analytics'>('overview')
  const [guildPlan, setGuildPlan] = useState<any>(null)

  useEffect(() => {
    checkUser()
    
    // Vérifier si c'est un retour de paiement Stripe
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const success = urlParams.get('success')
      const canceled = urlParams.get('canceled')
      if (success === 'true') {
        setPaymentSuccess(true)
        // Recharger le plan après quelques secondes
        setTimeout(() => {
          if (selectedGuild) {
            loadGuildPlan(selectedGuild)
          }
        }, 3000)
      }
      if (canceled === 'true') {
        // L'utilisateur a annulé, rien à faire
      }
    }
  }, [selectedGuild])

  useEffect(() => {
    if (selectedGuild) {
      loadStats(selectedGuild)
      loadGuildPlan(selectedGuild)
    }
  }, [selectedGuild, period])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/')
      return
    }
    setUser(session.user)
    loadGuilds()
  }

  async function loadGuilds() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('guild_id')
        .limit(1000)

      if (data) {
        const uniqueGuilds = Array.from(new Set(data.map(m => m.guild_id)))
        setGuilds(uniqueGuilds.map(id => ({ id, name: `Serveur ${id.slice(0, 8)}` })))
        if (uniqueGuilds.length > 0) {
          setSelectedGuild(uniqueGuilds[0])
        }
      }
      setLoading(false)
    } catch (error) {
      console.error('Erreur chargement serveurs:', error)
      setLoading(false)
    }
  }

  async function loadGuildPlan(guildId: string) {
    try {
      const { data } = await supabase
        .from('guild_subscriptions')
        .select('*')
        .eq('guild_id', guildId)
        .single()
      
      setGuildPlan(data || { plan_type: 'free', status: 'active' })
    } catch (error) {
      setGuildPlan({ plan_type: 'free', status: 'active' })
    }
  }

  async function loadStats(guildId: string) {
    setLoading(true)
    try {
      const daysAgo = period === 'all' ? 365 : parseInt(period)
      const dateLimit = new Date()
      dateLimit.setDate(dateLimit.getDate() - daysAgo)

      // Stats générales
      const { count: totalMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('guild_id', guildId)

      const { data: recentMessages } = await supabase
        .from('messages')
        .select('author_id, author_display_name, created_at, channel_id, is_question, reaction_count')
        .eq('guild_id', guildId)
        .gte('created_at', dateLimit.toISOString())

      const activeMembers = new Set(recentMessages?.map(m => m.author_id) || []).size
      const activeChannels = new Set(recentMessages?.map(m => m.channel_id) || []).size
      const totalQuestions = recentMessages?.filter(m => m.is_question).length || 0
      const totalReactions = recentMessages?.reduce((sum, m) => sum + (m.reaction_count || 0), 0) || 0

      // Données pour graphiques (activité par jour)
      const activityByDay: { [key: string]: number } = {}
      recentMessages?.forEach(msg => {
        const date = new Date(msg.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
        activityByDay[date] = (activityByDay[date] || 0) + 1
      })

      const chartDataArray = Object.entries(activityByDay)
        .map(([date, count]) => ({ date, messages: count }))
        .sort((a, b) => {
          const dateA = new Date(a.date.split('/').reverse().join('-'))
          const dateB = new Date(b.date.split('/').reverse().join('-'))
          return dateA.getTime() - dateB.getTime()
        })

      // Top membres
      const memberCounts: { [key: string]: { name: string; count: number; reactions: number } } = {}
      recentMessages?.forEach(msg => {
        const name = msg.author_display_name || msg.author_id
        if (!memberCounts[msg.author_id]) {
          memberCounts[msg.author_id] = { name, count: 0, reactions: 0 }
        }
        memberCounts[msg.author_id].count++
        memberCounts[msg.author_id].reactions += msg.reaction_count || 0
      })

      const topMembersArray = Object.entries(memberCounts)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      // Stats XP si disponible
      let xpStats = null
      try {
        const { data: xpData } = await supabase
          .from('user_xp')
          .select('user_id, xp, level')
          .eq('guild_id', guildId)
          .order('xp', { ascending: false })
          .limit(5)
        
        if (xpData && xpData.length > 0) {
          xpStats = {
            totalUsers: xpData.length,
            topLevel: Math.max(...xpData.map(u => u.level)),
            totalXP: xpData.reduce((sum, u) => sum + u.xp, 0)
          }
        }
      } catch (error) {
        // XP table might not exist
      }

      setStats({
        totalMessages: totalMessages || 0,
        activeMembers,
        activeChannels,
        totalQuestions,
        totalReactions,
        xpStats,
        periodDays: daysAgo
      })
      setChartData(chartDataArray)
      setTopMembers(topMembersArray)
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  function exportData() {
    if (!stats || !chartData) return
    
    const csv = [
      ['Statistiques', 'Valeur'],
      ['Messages totaux', stats.totalMessages],
      ['Membres actifs', stats.activeMembers],
      ['Canaux actifs', stats.activeChannels],
      ['Questions posées', stats.totalQuestions],
      ['Réactions totales', stats.totalReactions],
      ['', ''],
      ['Date', 'Messages'],
      ...chartData.map(d => [d.date, d.messages])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `community-intelligence-${selectedGuild}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des données...</p>
        </div>
      </div>
    )
  }

  const planColors: { [key: string]: string } = {
    free: 'bg-gray-600',
    pro: 'bg-blue-600',
    business: 'bg-purple-600',
    enterprise: 'bg-yellow-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/landing" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
                <Bot className="w-6 h-6" />
                <h1 className="text-xl font-bold">Community Intelligence</h1>
              </Link>
              {guildPlan && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${planColors[guildPlan.plan_type] || planColors.free}`}>
                  {guildPlan.plan_type === 'free' ? '🆓 Gratuit' : guildPlan.plan_type === 'pro' ? '💎 Pro' : guildPlan.plan_type === 'business' ? '🚀 Business' : '🏢 Enterprise'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span>{user.email || user.user_metadata?.full_name}</span>
                </div>
              )}
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800/30 backdrop-blur-sm border-r border-gray-700 min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'members' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              Membres
            </button>
            <button
              onClick={() => setActiveTab('channels')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'channels' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Hash className="w-5 h-5" />
              Canaux
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'analytics' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Analytics
            </button>
          </nav>

          {guildPlan && guildPlan.plan_type === 'free' && (
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <h3 className="text-white font-semibold mb-2">💎 Passez à Pro</h3>
              <p className="text-blue-100 text-sm mb-3">Débloquez toutes les fonctionnalités premium</p>
              <button
                onClick={async () => {
                  if (!selectedGuild) {
                    alert('Veuillez sélectionner un serveur d\'abord')
                    return
                  }
                  try {
                    const response = await fetch('/api/stripe/checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        planType: 'pro',
                        guildId: selectedGuild,
                        userId: user?.id,
                      }),
                    })
                    const data = await response.json()
                    if (data.url) {
                      window.location.href = data.url
                    } else {
                      alert('Erreur: ' + (data.error || 'Impossible de créer la session'))
                    }
                  } catch (error) {
                    alert('Erreur lors de la création du lien de paiement')
                  }
                }}
                className="block w-full text-center py-2 bg-white text-blue-600 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                Passer à Pro (25€/mois)
              </button>
            </div>
          )}
          
          {guildPlan && guildPlan.plan_type !== 'free' && guildPlan.stripe_customer_id && (
            <div className="mt-8 p-4 bg-gray-700/50 rounded-lg">
              <h3 className="text-white font-semibold mb-2">💳 Gérer l'abonnement</h3>
              <p className="text-gray-300 text-sm mb-3">Plan actuel: {guildPlan.plan_type.toUpperCase()}</p>
              <button
                onClick={async () => {
                  if (!selectedGuild) return
                  try {
                    const response = await fetch('/api/stripe/billing', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        guildId: selectedGuild,
                        userId: user?.id,
                      }),
                    })
                    const data = await response.json()
                    if (data.url) {
                      window.location.href = data.url
                    } else {
                      alert('Erreur: ' + (data.error || 'Impossible d\'accéder au portail'))
                    }
                  } catch (error) {
                    alert('Erreur lors de l\'accès au portail de facturation')
                  }
                }}
                className="block w-full text-center py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Ouvrir le portail de facturation
              </button>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Payment Success Message */}
          {paymentSuccess && (
            <div className="mb-6 p-4 bg-green-600/20 border border-green-500 rounded-lg">
              <p className="text-green-400 font-semibold">✅ Paiement réussi !</p>
              <p className="text-green-300 text-sm mt-1">Votre abonnement est en cours d'activation. Rafraîchissez la page dans quelques instants.</p>
            </div>
          )}

          {/* Server Selection & Period Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
              {guilds.length > 0 && (
                <select
                  value={selectedGuild}
                  onChange={(e) => setSelectedGuild(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
                >
                  {guilds.map(guild => (
                    <option key={guild.id} value={guild.id}>{guild.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">7 derniers jours</option>
                <option value="30">30 derniers jours</option>
                <option value="90">90 derniers jours</option>
                <option value="all">Tout l'historique</option>
              </select>
              {stats && (
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Exporter
                </button>
              )}
            </div>
          </div>

          {!selectedGuild ? (
            <div className="text-center py-12 max-w-2xl mx-auto">
              <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Aucun serveur disponible</h2>
              <p className="text-gray-400 mb-6">
                Le bot doit être actif sur au moins un serveur Discord et avoir collecté des messages pour que les statistiques apparaissent.
              </p>
              <Link
                href="https://discord.com/api/oauth2/authorize?client_id=1437809276927213628&permissions=274877906944&scope=bot%20applications.commands"
                target="_blank"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Inviter le bot
              </Link>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={<MessageSquare className="w-6 h-6" />}
                  title="Messages totaux"
                  value={stats?.totalMessages || 0}
                  color="text-blue-400"
                  bgColor="bg-blue-500/10"
                  trend={null}
                />
                <StatCard
                  icon={<Users className="w-6 h-6" />}
                  title={`Membres actifs (${period}j)`}
                  value={stats?.activeMembers || 0}
                  color="text-green-400"
                  bgColor="bg-green-500/10"
                  trend={null}
                />
                <StatCard
                  icon={<Hash className="w-6 h-6" />}
                  title="Canaux actifs"
                  value={stats?.activeChannels || 0}
                  color="text-yellow-400"
                  bgColor="bg-yellow-500/10"
                  trend={null}
                />
                <StatCard
                  icon={<Heart className="w-6 h-6" />}
                  title="Réactions totales"
                  value={stats?.totalReactions || 0}
                  color="text-pink-400"
                  bgColor="bg-pink-500/10"
                  trend={null}
                />
              </div>

              {activeTab === 'overview' && (
                <>
                  {/* Graphiques */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Activité par jour */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Activité ({period === 'all' ? 'Tout' : period}j)
                        </h2>
                      </div>
                      {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#5865F2" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#5865F2" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px' }}
                              labelStyle={{ color: '#F3F4F6' }}
                            />
                            <Area type="monotone" dataKey="messages" stroke="#5865F2" fillOpacity={1} fill="url(#colorMessages)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500">
                          Pas de données disponibles
                        </div>
                      )}
                    </div>

                    {/* Top membres */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl">
                      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Crown className="w-5 h-5" />
                        Top 10 membres actifs
                      </h2>
                      {topMembers.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={topMembers.slice(0, 10)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} fontSize={10} />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px' }}
                              labelStyle={{ color: '#F3F4F6' }}
                            />
                            <Bar dataKey="count" fill="#5865F2" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500">
                          Pas de données disponibles
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Liste des top membres */}
                  {topMembers.length > 0 && (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl">
                      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Classement des membres
                      </h2>
                      <div className="space-y-2">
                        {topMembers.map((member, index) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                                index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-600'
                              }`}>
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                              </div>
                              <div>
                                <span className="text-white font-medium">{member.name}</span>
                                {member.reactions > 0 && (
                                  <span className="text-gray-400 text-sm ml-2">❤️ {member.reactions}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-gray-400">{member.count} messages</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'members' && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl">
                  <h2 className="text-xl font-semibold text-white mb-4">Détails des membres</h2>
                  {topMembers.length > 0 ? (
                    <div className="space-y-2">
                      {topMembers.map((member, index) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-gray-500">#{index + 1}</span>
                            <span className="text-white font-medium">{member.name}</span>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <span className="text-gray-400">{member.count} messages</span>
                            {member.reactions > 0 && (
                              <span className="text-gray-400">{member.reactions} réactions</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-12">Pas de données disponibles</p>
                  )}
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl">
                  <h2 className="text-xl font-semibold text-white mb-4">Analytics avancés</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <h3 className="text-gray-400 text-sm mb-2">Questions posées</h3>
                      <p className="text-3xl font-bold text-white">{stats?.totalQuestions || 0}</p>
                    </div>
                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <h3 className="text-gray-400 text-sm mb-2">Taux d'engagement</h3>
                      <p className="text-3xl font-bold text-white">
                        {stats?.totalMessages > 0 
                          ? Math.round((stats.totalReactions / stats.totalMessages) * 100) 
                          : 0}%
                      </p>
                    </div>
                    {stats?.xpStats && (
                      <>
                        <div className="p-4 bg-gray-700/50 rounded-lg">
                          <h3 className="text-gray-400 text-sm mb-2">Utilisateurs avec XP</h3>
                          <p className="text-3xl font-bold text-white">{stats.xpStats.totalUsers}</p>
                        </div>
                        <div className="p-4 bg-gray-700/50 rounded-lg">
                          <h3 className="text-gray-400 text-sm mb-2">Niveau maximum</h3>
                          <p className="text-3xl font-bold text-white">{stats.xpStats.topLevel}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color, bgColor, trend }: any) {
  return (
    <div className={`${bgColor} rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} ${bgColor} p-3 rounded-lg`}>{icon}</div>
        {trend && (
          <span className={`text-sm font-semibold ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
    </div>
  )
}
