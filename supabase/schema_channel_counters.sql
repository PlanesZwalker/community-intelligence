-- Schéma pour les Channel Counters (compteurs visuels dans les canaux)
-- À exécuter dans Supabase SQL Editor

CREATE TABLE IF NOT EXISTS guild_channel_counters (
    id BIGSERIAL PRIMARY KEY,
    guild_id VARCHAR(255) NOT NULL,
    channel_id VARCHAR(255) NOT NULL,
    counter_type VARCHAR(50) NOT NULL, -- 'members', 'messages', 'online', 'messages_today'
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(guild_id, channel_id)
);

CREATE INDEX IF NOT EXISTS idx_guild_channel_counters_guild_id ON guild_channel_counters(guild_id);
CREATE INDEX IF NOT EXISTS idx_guild_channel_counters_enabled ON guild_channel_counters(guild_id, enabled);

