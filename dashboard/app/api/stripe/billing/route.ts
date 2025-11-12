import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials are not set')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const { guildId, userId } = await request.json()

    if (!guildId) {
      return NextResponse.json(
        { error: 'guildId est requis' },
        { status: 400 }
      )
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe n\'est pas configuré' },
        { status: 500 }
      )
    }

    // Récupérer le customer Stripe depuis Supabase
    const { data: subscription } = await supabase
      .from('guild_subscriptions')
      .select('stripe_customer_id')
      .eq('guild_id', guildId)
      .single()

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Aucun abonnement trouvé pour ce serveur' },
        { status: 404 }
      )
    }

    // Créer le portail de facturation
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://community-intelligence-chi.vercel.app'}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Erreur création portail facturation:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création du portail' },
      { status: 500 }
    )
  }
}

