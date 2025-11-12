-- Schéma pour l'intégration Stripe
-- À exécuter dans Supabase SQL Editor si la table n'existe pas déjà

-- Table des abonnements Stripe (alternative à subscriptions)
CREATE TABLE IF NOT EXISTS guild_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    guild_id VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255), -- Utilisateur qui a souscrit
    plan_type VARCHAR(50) NOT NULL DEFAULT 'free', -- free, pro, business, enterprise
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, canceled, past_due, trialing
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guild_subscriptions_guild_id ON guild_subscriptions(guild_id);
CREATE INDEX IF NOT EXISTS idx_guild_subscriptions_stripe_customer ON guild_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_guild_subscriptions_status ON guild_subscriptions(status);

