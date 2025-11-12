/**
 * Système de gestion des plans premium et limites
 */

const PLAN_LIMITS = {
  free: {
    messages: 10000,
    channels: 10,
    aiRequests: 0, // Pas d'IA
    exports: 0, // Pas d'export
    autoReports: 0, // Pas de rapports auto
    features: {
      ai: false,
      exports: false,
      autoReports: false,
      advancedAnalytics: false,
      api: false,
      webhooks: false,
    },
  },
  pro: {
    messages: -1, // Illimité
    channels: -1, // Illimité
    aiRequests: -1, // Illimité
    exports: -1, // Illimité
    autoReports: -1, // Illimité
    features: {
      ai: true,
      exports: true,
      autoReports: true,
      advancedAnalytics: true,
      api: false,
      webhooks: false,
    },
  },
  enterprise: {
    messages: -1,
    channels: -1,
    aiRequests: -1,
    exports: -1,
    autoReports: -1,
    features: {
      ai: true,
      exports: true,
      autoReports: true,
      advancedAnalytics: true,
      api: true,
      webhooks: true,
    },
  },
};

/**
 * Récupère le plan d'un serveur
 */
export async function getGuildPlan(guildId, supabase) {
  try {
    // Essayer d'abord guild_subscriptions (nouveau système Stripe)
    const { data: stripeSub, error: stripeError } = await supabase
      .from('guild_subscriptions')
      .select('*')
      .eq('guild_id', guildId)
      .single();

    if (stripeSub && !stripeError) {
      return {
        guild_id: guildId,
        plan_type: stripeSub.plan_type || 'free',
        status: stripeSub.status || 'active',
        stripe_customer_id: stripeSub.stripe_customer_id,
        stripe_subscription_id: stripeSub.stripe_subscription_id,
        current_period_end: stripeSub.current_period_end,
      };
    }

    // Fallback sur l'ancienne table subscriptions
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('guild_id', guildId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Erreur lors de la récupération du plan:', error);
      return null;
    }

    // Si pas d'abonnement, créer un plan gratuit par défaut
    if (!data) {
      await initializeGuild(guildId, supabase);
      return {
        guild_id: guildId,
        plan_type: 'free',
        status: 'active',
      };
    }

    // Vérifier si l'abonnement est expiré
    if (data.status === 'active' && data.current_period_end) {
      const now = new Date();
      const periodEnd = new Date(data.current_period_end);
      if (now > periodEnd) {
        // Abonnement expiré, rétrograder en free
        await updateGuildPlan(guildId, 'free', supabase);
        return {
          ...data,
          plan_type: 'free',
          status: 'expired',
        };
      }
    }

    return data;
  } catch (error) {
    console.error('Erreur dans getGuildPlan:', error);
    return null;
  }
}

/**
 * Initialise un serveur avec le plan gratuit
 */
export async function initializeGuild(guildId, supabase) {
  try {
    // Créer l'abonnement gratuit
    const { error: subError } = await supabase
      .from('subscriptions')
      .insert({
        guild_id: guildId,
        plan_type: 'free',
        status: 'active',
      })
      .select()
      .single();

    if (subError && subError.code !== '23505') { // Ignorer les doublons
      console.error('Erreur création abonnement:', subError);
    }

    // Initialiser les limites
    const { error: limitError } = await supabase
      .from('usage_limits')
      .insert({
        guild_id: guildId,
        messages_limit: PLAN_LIMITS.free.messages,
        channels_limit: PLAN_LIMITS.free.channels,
        ai_requests_limit: PLAN_LIMITS.free.aiRequests,
        exports_limit: PLAN_LIMITS.free.exports,
        auto_reports_limit: PLAN_LIMITS.free.autoReports,
      })
      .select()
      .single();

    if (limitError && limitError.code !== '23505') {
      console.error('Erreur création limites:', limitError);
    }

    // Initialiser les fonctionnalités
    const { error: featureError } = await supabase
      .from('guild_features')
      .insert({
        guild_id: guildId,
        ai_enabled: false,
        exports_enabled: false,
        auto_reports_enabled: false,
      })
      .select()
      .single();

    if (featureError && featureError.code !== '23505') {
      console.error('Erreur création fonctionnalités:', featureError);
    }

    return true;
  } catch (error) {
    console.error('Erreur dans initializeGuild:', error);
    return false;
  }
}

/**
 * Met à jour le plan d'un serveur
 */
export async function updateGuildPlan(guildId, planType, supabase, stripeData = null) {
  try {
    const plan = PLAN_LIMITS[planType];
    if (!plan) {
      throw new Error(`Plan invalide: ${planType}`);
    }

    // Mettre à jour l'abonnement
    const updateData = {
      plan_type: planType,
      updated_at: new Date().toISOString(),
    };

    if (stripeData) {
      updateData.stripe_subscription_id = stripeData.subscription_id;
      updateData.stripe_customer_id = stripeData.customer_id;
      updateData.current_period_start = stripeData.current_period_start;
      updateData.current_period_end = stripeData.current_period_end;
      updateData.status = stripeData.status || 'active';
    }

    const { error: subError } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('guild_id', guildId);

    if (subError) {
      console.error('Erreur mise à jour abonnement:', subError);
      return false;
    }

    // Mettre à jour les limites
    const { error: limitError } = await supabase
      .from('usage_limits')
      .update({
        messages_limit: plan.messages,
        channels_limit: plan.channels,
        ai_requests_limit: plan.aiRequests,
        exports_limit: plan.exports,
        auto_reports_limit: plan.autoReports,
        updated_at: new Date().toISOString(),
      })
      .eq('guild_id', guildId);

    if (limitError) {
      console.error('Erreur mise à jour limites:', limitError);
    }

    // Mettre à jour les fonctionnalités
    const { error: featureError } = await supabase
      .from('guild_features')
      .update({
        ai_enabled: plan.features.ai,
        exports_enabled: plan.features.exports,
        auto_reports_enabled: plan.features.autoReports,
        advanced_analytics: plan.features.advancedAnalytics,
        api_enabled: plan.features.api,
        webhooks_enabled: plan.features.webhooks,
        updated_at: new Date().toISOString(),
      })
      .eq('guild_id', guildId);

    if (featureError) {
      console.error('Erreur mise à jour fonctionnalités:', featureError);
    }

    return true;
  } catch (error) {
    console.error('Erreur dans updateGuildPlan:', error);
    return false;
  }
}

/**
 * Vérifie si une fonctionnalité est disponible pour un serveur
 */
export async function hasFeature(guildId, feature, supabase) {
  const plan = await getGuildPlan(guildId, supabase);
  if (!plan) return false;

  const planLimits = PLAN_LIMITS[plan.plan_type];
  if (!planLimits) return false;

  return planLimits.features[feature] || false;
}

/**
 * Vérifie si une limite est atteinte
 */
export async function checkLimit(guildId, limitType, supabase) {
  try {
    const { data, error } = await supabase
      .from('usage_limits')
      .select('*')
      .eq('guild_id', guildId)
      .single();

    if (error || !data) {
      // Si pas de limite, initialiser
      await initializeGuild(guildId, supabase);
      return { available: true, used: 0, limit: 0 };
    }

    const limitField = `${limitType}_limit`;
    const usedField = `${limitType}_used`;

    const limit = data[limitField];
    const used = data[usedField] || 0;

    // -1 signifie illimité
    if (limit === -1) {
      return { available: true, used, limit: -1 };
    }

    const available = used < limit;
    return {
      available,
      used,
      limit,
      remaining: limit - used,
    };
  } catch (error) {
    console.error('Erreur dans checkLimit:', error);
    return { available: false, used: 0, limit: 0 };
  }
}

/**
 * Incrémente un compteur d'utilisation
 */
export async function incrementUsage(guildId, limitType, amount = 1, supabase) {
  try {
    const { data, error } = await supabase
      .rpc('increment_usage', {
        guild_id_param: guildId,
        limit_type_param: limitType,
        amount_param: amount,
      });

    // Si la fonction RPC n'existe pas, utiliser une mise à jour manuelle
    if (error && error.code === '42883') {
      const { data: current } = await supabase
        .from('usage_limits')
        .select(`${limitType}_used`)
        .eq('guild_id', guildId)
        .single();

      if (current) {
        const newValue = (current[`${limitType}_used`] || 0) + amount;
        await supabase
          .from('usage_limits')
          .update({
            [`${limitType}_used`]: newValue,
            updated_at: new Date().toISOString(),
          })
          .eq('guild_id', guildId);
      }
    }

    return true;
  } catch (error) {
    console.error('Erreur dans incrementUsage:', error);
    return false;
  }
}

/**
 * Récupère les statistiques d'utilisation d'un serveur
 */
export async function getUsageStats(guildId, supabase) {
  try {
    const plan = await getGuildPlan(guildId, supabase);
    const { data: limits } = await supabase
      .from('usage_limits')
      .select('*')
      .eq('guild_id', guildId)
      .single();

    if (!limits) {
      await initializeGuild(guildId, supabase);
      return getUsageStats(guildId, supabase);
    }

    return {
      plan: plan?.plan_type || 'free',
      status: plan?.status || 'active',
      messages: {
        used: limits.messages_used || 0,
        limit: limits.messages_limit === -1 ? 'Illimité' : limits.messages_limit,
        percentage: limits.messages_limit === -1 ? 0 : Math.round((limits.messages_used / limits.messages_limit) * 100),
      },
      channels: {
        used: limits.channels_used || 0,
        limit: limits.channels_limit === -1 ? 'Illimité' : limits.channels_limit,
        percentage: limits.channels_limit === -1 ? 0 : Math.round((limits.channels_used / limits.channels_limit) * 100),
      },
      aiRequests: {
        used: limits.ai_requests_used || 0,
        limit: limits.ai_requests_limit === -1 ? 'Illimité' : limits.ai_requests_limit === 0 ? 'Non disponible' : limits.ai_requests_limit,
        percentage: limits.ai_requests_limit === -1 || limits.ai_requests_limit === 0 ? 0 : Math.round((limits.ai_requests_used / limits.ai_requests_limit) * 100),
      },
      exports: {
        used: limits.exports_used || 0,
        limit: limits.exports_limit === -1 ? 'Illimité' : limits.exports_limit === 0 ? 'Non disponible' : limits.exports_limit,
        percentage: limits.exports_limit === -1 || limits.exports_limit === 0 ? 0 : Math.round((limits.exports_used / limits.exports_limit) * 100),
      },
    };
  } catch (error) {
    console.error('Erreur dans getUsageStats:', error);
    return null;
  }
}

/**
 * Formate un message d'erreur pour limite atteinte
 */
export function getLimitErrorMessage(limitType, planType) {
  const messages = {
    messages: 'Vous avez atteint la limite de messages pour le plan gratuit (10,000 messages).',
    channels: 'Vous avez atteint la limite de canaux pour le plan gratuit (10 canaux).',
    aiRequests: 'Les fonctionnalités IA ne sont pas disponibles avec le plan gratuit.',
    exports: 'L\'export de données n\'est pas disponible avec le plan gratuit.',
    autoReports: 'Les rapports automatiques ne sont pas disponibles avec le plan gratuit.',
  };

  const upgradeMessage = planType === 'free' 
    ? '\n\n💎 **Passez à Pro** pour débloquer cette fonctionnalité : `/ci-upgrade`'
    : '';

  return `${messages[limitType] || 'Limite atteinte.'}${upgradeMessage}`;
}

