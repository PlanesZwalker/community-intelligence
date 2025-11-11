-- Schéma de base de données pour Community Intelligence Bot

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

-- Table pour les configurations par serveur (pour les fonctionnalités futures)
CREATE TABLE IF NOT EXISTS guild_config (
    guild_id VARCHAR(255) PRIMARY KEY,
    auto_summary_enabled BOOLEAN DEFAULT FALSE,
    summary_channel_id VARCHAR(255),
    summary_frequency VARCHAR(50) DEFAULT 'weekly',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

