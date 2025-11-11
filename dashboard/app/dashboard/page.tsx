'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { LogOut, MessageSquare, Users, Hash, TrendingUp, AlertCircle } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const COLORS = ['#5865F2', '#57F287', '#FEE75C', '#EB459E', '#ED4245']

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [guilds, setGuilds] = useState<any[]>([])
  const [selectedGuild, setSelectedGuild] = useState<string>('')
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])
  const [topMembers, setTopMembers] = useState<any[]>([])

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (selectedGuild) {
      loadStats(selectedGuild)
    }
  }, [selectedGuild])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/')
      return
    }
    setUser(session.user)
    // Pour l'instant, on charge tous les serveurs depuis la DB
    // Dans une vraie app, on utiliserait l'API Discord pour obtenir les serveurs de l'utilisateur
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

  async function loadStats(guildId: string) {
    setLoading(true)
    try {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      // Stats générales
      const { count: totalMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('guild_id', guildId)

      const { data: recentMessages } = await supabase
        .from('messages')
        .select('author_id, author_display_name, created_at, channel_id, is_question')
        .eq('guild_id', guildId)
        .gte('created_at', sevenDaysAgo.toISOString())

      const activeMembers = new Set(recentMessages?.map(m => m.author_id) || []).size
      const activeChannels = new Set(recentMessages?.map(m => m.channel_id) || []).size
      const totalQuestions = recentMessages?.filter(m => m.is_question).length || 0

      // Données pour graphiques (activité par jour)
      const activityByDay: { [key: string]: number } = {}
      recentMessages?.forEach(msg => {
        const date = new Date(msg.created_at).toLocaleDateString('fr-FR')
        activityByDay[date] = (activityByDay[date] || 0) + 1
      })

      const chartDataArray = Object.entries(activityByDay)
        .map(([date, count]) => ({ date, messages: count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      // Top membres
      const memberCounts: { [key: string]: { name: string; count: number } } = {}
      recentMessages?.forEach(msg => {
        const name = msg.author_display_name || msg.author_id
        if (!memberCounts[msg.author_id]) {
          memberCounts[msg.author_id] = { name, count: 0 }
        }
        memberCounts[msg.author_id].count++
      })

      const topMembersArray = Object.entries(memberCounts)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      setStats({
        totalMessages: totalMessages || 0,
        activeMembers,
        activeChannels,
        totalQuestions,
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

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-discord-blurple"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-discord-not-quite-black">
      {/* Header */}
      <header className="bg-discord-dark-but-not-black border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Community Intelligence</h1>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-gray-400 text-sm">{user.email || user.user_metadata?.full_name}</span>
              )}
              <button
                onClick={signOut}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sélection du serveur */}
        {guilds.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sélectionner un serveur
            </label>
            <select
              value={selectedGuild}
              onChange={(e) => setSelectedGuild(e.target.value)}
              className="bg-discord-dark-but-not-black border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-discord-blurple"
            >
              {guilds.map(guild => (
                <option key={guild.id} value={guild.id}>{guild.name}</option>
              ))}
            </select>
          </div>
        )}

        {!selectedGuild ? (
          <div className="text-center py-12 max-w-2xl mx-auto">
            <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Aucun serveur disponible</h2>
            <p className="text-gray-400 mb-6">
              Le bot doit être actif sur au moins un serveur Discord et avoir collecté des messages pour que les statistiques apparaissent.
            </p>
            
            <div className="bg-discord-dark-but-not-black rounded-lg p-6 text-left space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">📋 Étapes pour inviter le bot :</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
                  <li>Allez sur <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Discord Developer Portal</a></li>
                  <li>Sélectionnez votre application <strong>Community Intelligence</strong></li>
                  <li>Allez dans <strong>OAuth2</strong> → <strong>URL Generator</strong></li>
                  <li>Sélectionnez les scopes : <code className="bg-gray-800 px-1 rounded">bot</code> et <code className="bg-gray-800 px-1 rounded">applications.commands</code></li>
                  <li>Sélectionnez les permissions : <code className="bg-gray-800 px-1 rounded">Read Messages</code>, <code className="bg-gray-800 px-1 rounded">Send Messages</code>, <code className="bg-gray-800 px-1 rounded">Read Message History</code></li>
                  <li>Copiez l'URL générée en bas de la page</li>
                  <li>Ouvrez l'URL dans votre navigateur et sélectionnez un serveur Discord</li>
                  <li>Autorisez le bot à rejoindre votre serveur</li>
                </ol>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-white font-semibold mb-2">✅ Vérifications :</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                  <li>Le bot est-il en ligne sur Render ? Vérifiez les logs : <a href="https://dashboard.render.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Render Dashboard</a></li>
                  <li>Le bot est-il présent sur votre serveur Discord ? (visible dans la liste des membres)</li>
                  <li>Y a-t-il eu des messages envoyés sur le serveur depuis l'invitation du bot ?</li>
                  <li>Les messages apparaissent-ils dans Supabase ? Vérifiez : <a href="https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh/editor" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Table Editor</a></li>
                </ul>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500">
                  💡 <strong>Note</strong> : Le bot collecte uniquement les messages envoyés <strong>après</strong> son activation. 
                  Envoyez quelques messages sur votre serveur, puis rafraîchissez cette page.
                </p>
              </div>
            </div>
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
              />
              <StatCard
                icon={<Users className="w-6 h-6" />}
                title="Membres actifs (7j)"
                value={stats?.activeMembers || 0}
                color="text-green-400"
              />
              <StatCard
                icon={<Hash className="w-6 h-6" />}
                title="Canaux actifs"
                value={stats?.activeChannels || 0}
                color="text-yellow-400"
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Questions posées"
                value={stats?.totalQuestions || 0}
                color="text-purple-400"
              />
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Activité par jour */}
              <div className="bg-discord-dark-but-not-black rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Activité (7 derniers jours)</h2>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#2C2F33', border: '1px solid #4B5563', borderRadius: '8px' }}
                        labelStyle={{ color: '#F3F4F6' }}
                      />
                      <Line type="monotone" dataKey="messages" stroke="#5865F2" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-12">Pas de données disponibles</p>
                )}
              </div>

              {/* Top membres */}
              <div className="bg-discord-dark-but-not-black rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Top 5 membres actifs</h2>
                {topMembers.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topMembers}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#2C2F33', border: '1px solid #4B5563', borderRadius: '8px' }}
                        labelStyle={{ color: '#F3F4F6' }}
                      />
                      <Bar dataKey="count" fill="#5865F2" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-12">Pas de données disponibles</p>
                )}
              </div>
            </div>

            {/* Liste des top membres */}
            {topMembers.length > 0 && (
              <div className="bg-discord-dark-but-not-black rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Classement des membres</h2>
                <div className="space-y-2">
                  {topMembers.map((member, index) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-discord-not-quite-black rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-500">#{index + 1}</span>
                        <span className="text-white font-medium">{member.name}</span>
                      </div>
                      <span className="text-gray-400">{member.count} messages</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function StatCard({ icon, title, value, color }: any) {
  return (
    <div className="bg-discord-dark-but-not-black rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <div className={`${color}`}>{icon}</div>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
    </div>
  )
}

