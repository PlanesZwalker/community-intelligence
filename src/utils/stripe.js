/**
 * Intégration Stripe pour les paiements
 * Gère les checkout sessions, webhooks, et abonnements
 */

/**
 * Crée une session de checkout Stripe pour un plan
 */
export async function createCheckoutSession(guildId, planType, userId, supabase) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY non configurée');
  }

  const stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);

  // Prix des plans (en centimes d'euros)
  const planPrices = {
    pro: 2500, // 25€
    business: 7500, // 75€
    enterprise: 25000, // 250€
  };

  const planNames = {
    pro: 'Pro',
    business: 'Business',
    enterprise: 'Enterprise',
  };

  const priceId = planPrices[planType];
  if (!priceId) {
    throw new Error(`Plan ${planType} invalide`);
  }

  // Créer ou récupérer le customer Stripe
  let customerId = await getStripeCustomerId(guildId, userId, supabase);

  if (!customerId) {
    // Créer un nouveau customer
    const customer = await stripe.customers.create({
      metadata: {
        guild_id: guildId,
        user_id: userId,
      },
    });
    customerId = customer.id;

    // Sauvegarder dans Supabase
    await supabase
      .from('guild_subscriptions')
      .upsert({
        guild_id: guildId,
        stripe_customer_id: customerId,
        user_id: userId,
      });
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
    success_url: `${process.env.BOT_URL || 'https://community-intelligence-chi.vercel.app'}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
    cancel_url: `${process.env.BOT_URL || 'https://community-intelligence-chi.vercel.app'}/dashboard?canceled=true`,
    metadata: {
      guild_id: guildId,
      user_id: userId,
      plan_type: planType,
    },
  });

  return {
    sessionId: session.id,
    url: session.url,
  };
}

/**
 * Récupère l'ID du customer Stripe pour un serveur
 */
async function getStripeCustomerId(guildId, userId, supabase) {
  const { data } = await supabase
    .from('guild_subscriptions')
    .select('stripe_customer_id')
    .eq('guild_id', guildId)
    .single();

  return data?.stripe_customer_id || null;
}

/**
 * Crée un portail de facturation Stripe pour gérer l'abonnement
 */
export async function createBillingPortal(guildId, userId, supabase) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY non configurée');
  }

  const stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);

  const customerId = await getStripeCustomerId(guildId, userId, supabase);
  if (!customerId) {
    throw new Error('Aucun abonnement trouvé pour ce serveur');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.BOT_URL || 'https://community-intelligence-chi.vercel.app'}/dashboard`,
  });

  return {
    url: session.url,
  };
}

/**
 * Traite un webhook Stripe
 */
export async function handleStripeWebhook(event, supabase) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY non configurée');
  }

  const stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object, supabase);
      break;

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object, supabase);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object, supabase);
      break;

    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object, supabase);
      break;

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object, supabase);
      break;

    default:
      console.log(`Webhook non géré: ${event.type}`);
  }
}

/**
 * Gère la complétion d'un checkout
 */
async function handleCheckoutCompleted(session, supabase) {
  const { guild_id, plan_type, user_id } = session.metadata;

  if (!guild_id || !plan_type) {
    console.error('Metadata manquante dans la session Stripe');
    return;
  }

  // Mettre à jour le plan du serveur
  await supabase
    .from('guild_subscriptions')
    .upsert({
      guild_id,
      user_id: user_id || null,
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      plan_type,
      status: 'active',
      current_period_end: new Date(session.subscription_details?.metadata?.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    });

  console.log(`✅ Abonnement activé: ${guild_id} - Plan ${plan_type}`);
}

/**
 * Gère la mise à jour d'un abonnement
 */
async function handleSubscriptionUpdated(subscription, supabase) {
  const customerId = subscription.customer;

  const { data: sub } = await supabase
    .from('guild_subscriptions')
    .select('guild_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!sub) return;

  await supabase
    .from('guild_subscriptions')
    .update({
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('guild_id', sub.guild_id);

  console.log(`🔄 Abonnement mis à jour: ${sub.guild_id} - Status: ${subscription.status}`);
}

/**
 * Gère l'annulation d'un abonnement
 */
async function handleSubscriptionDeleted(subscription, supabase) {
  const customerId = subscription.customer;

  await supabase
    .from('guild_subscriptions')
    .update({
      status: 'canceled',
      plan_type: 'free',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId);

  console.log(`❌ Abonnement annulé: ${customerId}`);
}

/**
 * Gère un paiement réussi
 */
async function handlePaymentSucceeded(invoice, supabase) {
  const customerId = invoice.customer;

  const { data: sub } = await supabase
    .from('guild_subscriptions')
    .select('guild_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (sub) {
    await supabase
      .from('guild_subscriptions')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('guild_id', sub.guild_id);

    console.log(`💳 Paiement réussi: ${sub.guild_id}`);
  }
}

/**
 * Gère un paiement échoué
 */
async function handlePaymentFailed(invoice, supabase) {
  const customerId = invoice.customer;

  const { data: sub } = await supabase
    .from('guild_subscriptions')
    .select('guild_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (sub) {
    await supabase
      .from('guild_subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('guild_id', sub.guild_id);

    console.log(`⚠️ Paiement échoué: ${sub.guild_id}`);
  }
}

