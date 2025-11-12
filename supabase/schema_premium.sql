-- Schéma de base de données pour Community Intelligence Bot
-- Version avec système de monétisation

-- Table principale pour stocker les messages
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    message_id VARCHAR(255) UNIQUE NOT NULL,
    guild_id VARCHAR(255) NOT NULL,
    channel_id VARCHAR(255) NOT NULL,
    author_id VARCHAR(255) NOT NULL,
    author_username VARCHAR(255) NOT NULL,
    author_display_name VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    has_attachments BOOLEAN DEFAULT FALSE,
    has_embeds BOOLEAN DEFAULT FALSE,
    reaction_count INTEGER DEFAULT 0,
    is_question BOOLEAN DEFAULT FALSE,
    is_reply BOOLEAN DEFAULT FALSE,
    inserted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_messages_guild_id ON messages(guild_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_author_id ON messages(author_id);
CREATE INDEX IF NOT EXISTS idx_messages_channel_id ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_question ON messages(is_question);

-- Table pour stocker les statistiques agrégées (optionnel, pour optimiser)
CREATE TABLE IF NOT EXISTS guild_stats (
    guild_id VARCHAR(255) PRIMARY KEY,
    total_messages BIGINT DEFAULT 0,
    active_members INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les configurations par serveur
CREATE TABLE IF NOT EXISTS guild_config (
    guild_id VARCHAR(255) PRIMARY KEY,
    auto_summary_enabled BOOLEAN DEFAULT FALSE,
    summary_channel_id VARCHAR(255),
    summary_frequency VARCHAR(50) DEFAULT 'weekly',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SYSTÈME DE MONÉTISATION
-- ============================================

-- Table des abonnements
CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGSERIAL PRIMARY KEY,
    guild_id VARCHAR(255) UNIQUE NOT NULL,
    plan_type VARCHAR(50) NOT NULL DEFAULT 'free', -- free, pro, enterprise
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, cancelled, expired, trialing
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_subscriptions_guild_id ON subscriptions(guild_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_type ON subscriptions(plan_type);

-- Table des limites d'utilisation
CREATE TABLE IF NOT EXISTS usage_limits (
    guild_id VARCHAR(255) PRIMARY KEY,
    messages_limit BIGINT DEFAULT 10000, -- -1 pour illimité
    messages_used BIGINT DEFAULT 0,
    channels_limit INTEGER DEFAULT 10, -- -1 pour illimité
    channels_used INTEGER DEFAULT 0,
    ai_requests_limit INTEGER DEFAULT 0, -- 0 pour pas d'IA, -1 pour illimité
    ai_requests_used INTEGER DEFAULT 0,
    exports_limit INTEGER DEFAULT 0, -- 0 pour pas d'export, -1 pour illimité
    exports_used INTEGER DEFAULT 0,
    auto_reports_limit INTEGER DEFAULT 0, -- 0 pour pas de rapports auto
    auto_reports_used INTEGER DEFAULT 0,
    last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des fonctionnalités activées par plan
CREATE TABLE IF NOT EXISTS guild_features (
    guild_id VARCHAR(255) PRIMARY KEY,
    auto_reports_enabled BOOLEAN DEFAULT FALSE,
    ai_enabled BOOLEAN DEFAULT FALSE,
    exports_enabled BOOLEAN DEFAULT FALSE,
    api_enabled BOOLEAN DEFAULT FALSE,
    webhooks_enabled BOOLEAN DEFAULT FALSE,
    advanced_analytics BOOLEAN DEFAULT FALSE,
    sentiment_analysis BOOLEAN DEFAULT FALSE,
    custom_dashboards BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des clés API (pour Enterprise)
CREATE TABLE IF NOT EXISTS api_keys (
    id BIGSERIAL PRIMARY KEY,
    guild_id VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    key_prefix VARCHAR(20) NOT NULL, -- Premiers caractères pour affichage
    name VARCHAR(255),
    last_used TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (guild_id) REFERENCES subscriptions(guild_id) ON DELETE CASCADE
);

-- Index pour les clés API
CREATE INDEX IF NOT EXISTS idx_api_keys_guild_id ON api_keys(guild_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);

-- Table des exports (pour tracking)
CREATE TABLE IF NOT EXISTS exports (
    id BIGSERIAL PRIMARY KEY,
    guild_id VARCHAR(255) NOT NULL,
    export_type VARCHAR(50) NOT NULL, -- csv, json, pdf
    format VARCHAR(50), -- messages, stats, analytics
    file_url TEXT,
    file_size BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (guild_id) REFERENCES subscriptions(guild_id) ON DELETE CASCADE
);

-- Index pour les exports
CREATE INDEX IF NOT EXISTS idx_exports_guild_id ON exports(guild_id);
CREATE INDEX IF NOT EXISTS idx_exports_created_at ON exports(created_at);

-- Table des rapports automatiques
CREATE TABLE IF NOT EXISTS auto_reports (
    id BIGSERIAL PRIMARY KEY,
    guild_id VARCHAR(255) NOT NULL,
    channel_id VARCHAR(255) NOT NULL,
    frequency VARCHAR(50) NOT NULL, -- daily, weekly, monthly
    next_run_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_run_at TIMESTAMP WITH TIME ZONE,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (guild_id) REFERENCES subscriptions(guild_id) ON DELETE CASCADE
);

-- Index pour les rapports automatiques
CREATE INDEX IF NOT EXISTS idx_auto_reports_guild_id ON auto_reports(guild_id);
CREATE INDEX IF NOT EXISTS idx_auto_reports_next_run ON auto_reports(next_run_at);

-- Fonction pour initialiser un nouveau serveur avec plan gratuit
CREATE OR REPLACE FUNCTION initialize_guild(guild_id_param VARCHAR(255))
RETURNS VOID AS $$
BEGIN
    -- Créer l'abonnement gratuit
    INSERT INTO subscriptions (guild_id, plan_type, status)
    VALUES (guild_id_param, 'free', 'active')
    ON CONFLICT (guild_id) DO NOTHING;
    
    -- Initialiser les limites pour le plan gratuit
    INSERT INTO usage_limits (guild_id, messages_limit, channels_limit)
    VALUES (guild_id_param, 10000, 10)
    ON CONFLICT (guild_id) DO NOTHING;
    
    -- Initialiser les fonctionnalités (toutes désactivées pour free)
    INSERT INTO guild_features (guild_id)
    VALUES (guild_id_param)
    ON CONFLICT (guild_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour les limites selon le plan
CREATE OR REPLACE FUNCTION update_plan_limits(guild_id_param VARCHAR(255), plan_type_param VARCHAR(255))
RETURNS VOID AS $$
DECLARE
    messages_limit_val BIGINT;
    channels_limit_val INTEGER;
    ai_enabled_val BOOLEAN;
    exports_enabled_val BOOLEAN;
    auto_reports_enabled_val BOOLEAN;
BEGIN
    -- Définir les limites selon le plan
    CASE plan_type_param
        WHEN 'free' THEN
            messages_limit_val := 10000;
            channels_limit_val := 10;
            ai_enabled_val := FALSE;
            exports_enabled_val := FALSE;
            auto_reports_enabled_val := FALSE;
        WHEN 'pro' THEN
            messages_limit_val := -1; -- Illimité
            channels_limit_val := -1; -- Illimité
            ai_enabled_val := TRUE;
            exports_enabled_val := TRUE;
            auto_reports_enabled_val := TRUE;
        WHEN 'enterprise' THEN
            messages_limit_val := -1;
            channels_limit_val := -1;
            ai_enabled_val := TRUE;
            exports_enabled_val := TRUE;
            auto_reports_enabled_val := TRUE;
        ELSE
            -- Par défaut, plan gratuit
            messages_limit_val := 10000;
            channels_limit_val := 10;
            ai_enabled_val := FALSE;
            exports_enabled_val := FALSE;
            auto_reports_enabled_val := FALSE;
    END CASE;
    
    -- Mettre à jour les limites
    UPDATE usage_limits
    SET 
        messages_limit = messages_limit_val,
        channels_limit = channels_limit_val,
        updated_at = NOW()
    WHERE guild_id = guild_id_param;
    
    -- Mettre à jour les fonctionnalités
    UPDATE guild_features
    SET 
        ai_enabled = ai_enabled_val,
        exports_enabled = exports_enabled_val,
        auto_reports_enabled = auto_reports_enabled_val,
        advanced_analytics = (plan_type_param = 'pro' OR plan_type_param = 'enterprise'),
        api_enabled = (plan_type_param = 'enterprise'),
        webhooks_enabled = (plan_type_param = 'enterprise'),
        updated_at = NOW()
    WHERE guild_id = guild_id_param;
END;
$$ LANGUAGE plpgsql;

