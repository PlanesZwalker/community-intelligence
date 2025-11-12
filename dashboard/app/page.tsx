'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    // Vérifier s'il y a un code dans l'URL (callback OAuth)
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')
    const errorDescription = urlParams.get('error_description')
    
    if (error) {
      console.error('Erreur OAuth:', error, errorDescription)
      
      // Décoder l'URL pour un message plus lisible
      const decodedError = errorDescription 
        ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
        : error
      
      if (decodedError.includes('Unable to exchange external code')) {
        setErrorMessage('Erreur d\'authentification Discord. Le Client Secret dans Supabase ne correspond pas à celui de votre application Discord. Veuillez vérifier la configuration dans Supabase.')
      } else {
        setErrorMessage(`Erreur: ${decodedError}`)
      }
      
      setLoading(false)
      return
    }

    // Écouter les changements de session (important pour le callback OAuth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user)
        // Nettoyer l'URL des paramètres OAuth
        window.history.replaceState({}, '', '/')
        router.push('/dashboard')
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setUser(session.user)
      }
    })

    // Si on a un code, vérifier d'abord si la session existe déjà
    // (Supabase peut avoir déjà traité le code)
    if (code) {
      // Vérifier immédiatement si la session existe
      checkUser().then(() => {
        // Si pas de session après 2 secondes, vérifier à nouveau
        // (au cas où Supabase traite le code de manière asynchrone)
        setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession()
          if (!session) {
            // Toujours pas de session, arrêter le loading pour éviter une boucle infinie
            setLoading(false)
          }
        }, 2000)
      })
    } else {
      // Vérifier la session normale
      checkUser()
    }

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      setUser(session.user)
      router.push('/dashboard')
    } else {
      setLoading(false)
    }
  }

  async function signInWithDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/`,
        scopes: 'identify email guilds',
      },
    })
    if (error) {
      console.error('Erreur connexion Discord:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-discord-blurple"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-discord-dark-but-not-black rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Community Intelligence
          </h1>
          <p className="text-gray-400">
            Dashboard d'analyse pour votre communauté Discord
          </p>
          <Link 
            href="/landing" 
            className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
          >
            Découvrir les fonctionnalités →
          </Link>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm font-semibold mb-2">⚠️ Erreur d'authentification</p>
            <p className="text-red-300 text-xs mb-3">{errorMessage}</p>
            <div className="text-xs text-gray-400 space-y-1 mb-3">
              <p><strong>Solution :</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Allez sur <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Discord Developer Portal</a></li>
                <li>OAuth2 → General → Copiez le <strong>Client Secret</strong></li>
                <li>Allez sur <a href="https://supabase.com/dashboard/project/twpznfiyatzuwkyfgudh/auth/providers" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Supabase Auth Providers</a></li>
                <li>Discord → Collez le Client Secret → Save</li>
                <li>Attendez 1-2 minutes puis cliquez sur "Réessayer"</li>
              </ol>
            </div>
            <button
              onClick={() => {
                setErrorMessage(null)
                window.location.href = '/'
              }}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 px-4 rounded transition-colors"
            >
              Réessayer après correction
            </button>
          </div>
        )}

        <button
          onClick={signInWithDiscord}
          className="w-full bg-discord-blurple hover:bg-[#4752C4] text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!!errorMessage}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          Se connecter avec Discord
        </button>

        <p className="text-xs text-gray-500 text-center mt-6">
          En vous connectant, vous autorisez l'accès à vos serveurs Discord
        </p>
      </div>
    </div>
  )
}

