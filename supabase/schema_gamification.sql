-- Schéma pour le système de gamification (XP/Levels)
-- À exécuter dans Supabase SQL Editor

-- Table pour stocker l'XP et les niveaux des membres
CREATE TABLE IF NOT EXISTS member_xp (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    guild_id VARCHAR(255) NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_messages INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, guild_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_member_xp_guild_id ON member_xp(guild_id);
CREATE INDEX IF NOT EXISTS idx_member_xp_user_id ON member_xp(user_id);
CREATE INDEX IF NOT EXISTS idx_member_xp_level ON member_xp(guild_id, level DESC);
CREATE INDEX IF NOT EXISTS idx_member_xp_xp ON member_xp(guild_id, xp DESC);

-- Table pour les récompenses automatiques (rôles basés sur niveau)
CREATE TABLE IF NOT EXISTS guild_xp_rewards (
    id BIGSERIAL PRIMARY KEY,
    guild_id VARCHAR(255) NOT NULL,
    level INTEGER NOT NULL,
    role_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(guild_id, level)
);

CREATE INDEX IF NOT EXISTS idx_guild_xp_rewards_guild_id ON guild_xp_rewards(guild_id);

-- Table pour la configuration XP par serveur
CREATE TABLE IF NOT EXISTS guild_xp_config (
    guild_id VARCHAR(255) PRIMARY KEY,
    xp_per_message INTEGER DEFAULT 1,
    xp_per_question INTEGER DEFAULT 5,
    xp_per_reply INTEGER DEFAULT 3,
    xp_per_reaction INTEGER DEFAULT 1,
    cooldown_seconds INTEGER DEFAULT 60, -- Cooldown entre messages pour éviter le spam
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

