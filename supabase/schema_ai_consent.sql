-- Schéma pour le consentement IA conforme RGPD
-- Les fonctionnalités IA nécessitent un consentement explicite car les données sont envoyées à des services tiers (Groq, OpenAI, etc.)

-- Table pour stocker le consentement IA par serveur
CREATE TABLE IF NOT EXISTS guild_ai_consent (
    guild_id VARCHAR(255) PRIMARY KEY,
    ai_consent_given BOOLEAN DEFAULT FALSE,
    ai_consent_date TIMESTAMP WITH TIME ZONE,
    ai_consent_user_id VARCHAR(255), -- ID de l'utilisateur qui a donné le consentement
    ai_provider VARCHAR(50) DEFAULT 'groq', -- Provider utilisé (groq, openai, anthropic)
    data_retention_days INTEGER DEFAULT 30, -- Durée de conservation des données envoyées à l'IA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les requêtes
CREATE INDEX IF NOT EXISTS idx_ai_consent_guild ON guild_ai_consent(guild_id);
CREATE INDEX IF NOT EXISTS idx_ai_consent_given ON guild_ai_consent(ai_consent_given);

-- Commentaire explicatif
COMMENT ON TABLE guild_ai_consent IS 'Consentement RGPD pour l''utilisation de l''IA générative. Les données sont envoyées à des services tiers (Groq, OpenAI, Anthropic) pour traitement. Le consentement doit être explicite et peut être retiré à tout moment.';

