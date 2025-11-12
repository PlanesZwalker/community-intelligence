import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const { planType, guildId, userId } = await request.json()

    if (!planType || !guildId) {
      return NextResponse.json(
        { error: 'planType et guildId sont requis' },
        { status: 400 }
      )
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe n\'est pas configuré' },
        { status: 500 }
      )
    }

    // Prix des plans (en centimes d'euros)
    const planPrices: { [key: string]: number } = {
      pro: 2500, // 25€
      business: 7500, // 75€
      enterprise: 25000, // 250€
    }

    const planNames: { [key: string]: string } = {
      pro: 'Pro',
      business: 'Business',
      enterprise: 'Enterprise',
    }

    const priceId = planPrices[planType]
    if (!priceId) {
      return NextResponse.json(
        { error: `Plan ${planType} invalide` },
        { status: 400 }
      )
    }

    // Créer ou récupérer le customer Stripe
    let customerId: string | undefined

    // Essayer de trouver un customer existant
    if (guildId) {
      const customers = await stripe.customers.list({
        limit: 100,
      })
      const existingCustomer = customers.data.find(
        c => c.metadata?.guild_id === guildId
      )
      if (existingCustomer) {
        customerId = existingCustomer.id
      }
    }

    // Créer un nouveau customer si nécessaire
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {
          guild_id: guildId,
          user_id: userId || '',
        },
      })
      customerId = customer.id
    }

    // Créer la session de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Community Intelligence - Plan ${planNames[planType]}`,
              description: `Abonnement ${planNames[planType]} pour votre serveur Discord`,
            },
            unit_amount: priceId,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://community-intelligence-chi.vercel.app'}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://community-intelligence-chi.vercel.app'}/dashboard?canceled=true`,
      metadata: {
        guild_id: guildId,
        user_id: userId || '',
        plan_type: planType,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Erreur création session Stripe:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la session' },
      { status: 500 }
    )
  }
}

