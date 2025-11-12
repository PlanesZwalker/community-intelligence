/**
 * Système de Channel Counters - Compteurs visuels dans les canaux Discord
 * Met à jour automatiquement le nom des canaux avec des statistiques en temps réel
 */

/**
 * Formate un nombre avec des séparateurs de milliers
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Met à jour un channel counter avec les statistiques actuelles
 */
export async function updateChannelCounter(channel, counterType, value, supabase, guildId) {
  try {
    // Formater la valeur selon le type
    let displayValue = formatNumber(value);
    
    // Créer le nouveau nom du canal avec le compteur
    const baseName = channel.name.replace(/^📊\s*|^💬\s*|^👥\s*|^🔢\s*/g, '').split('─')[0].trim();
    let newName = '';
    
    switch (counterType) {
      case 'members':
        newName = `📊 Membres: ${displayValue}`;
        break;
      case 'messages':
        newName = `💬 Messages: ${displayValue}`;
        break;
      case 'online':
        newName = `👥 En ligne: ${displayValue}`;
        break;
      case 'messages_today':
        newName = `💬 Aujourd'hui: ${displayValue}`;
        break;
      default:
        newName = `🔢 ${counterType}: ${displayValue}`;
    }
    
    // Si le nom a changé, le mettre à jour
    if (channel.name !== newName) {
      await channel.setName(newName, 'Mise à jour automatique du compteur');
      console.log(`   ✅ Counter mis à jour: ${channel.name} → ${newName}`);
    }
  } catch (error) {
    // Erreur de permission ou autre
    if (error.code === 50013) {
      console.log(`   ⚠️ Pas de permission pour modifier le canal ${channel.name}`);
    } else {
      console.error(`   ❌ Erreur mise à jour counter ${channel.name}:`, error.message);
    }
  }
}

/**
 * Récupère les statistiques pour un type de counter
 */
export async function getCounterStats(guildId, counterType, supabase, guild) {
  switch (counterType) {
    case 'members':
      return guild.memberCount || 0;
    
    case 'online':
      return guild.members.cache.filter(m => m.presence?.status === 'online' || m.presence?.status === 'idle').size;
    
    case 'messages':
      const { count: totalMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('guild_id', guildId);
      return totalMessages || 0;
    
    case 'messages_today':
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('guild_id', guildId)
        .gte('created_at', today.toISOString());
      return todayMessages || 0;
    
    default:
      return 0;
  }
}

/**
 * Met à jour tous les channel counters d'un serveur
 */
export async function updateAllChannelCounters(guild, supabase) {
  try {
    // Récupérer la configuration des counters pour ce serveur
    const { data: counterConfigs } = await supabase
      .from('guild_channel_counters')
      .select('*')
      .eq('guild_id', guild.id)
      .eq('enabled', true);

    if (!counterConfigs || counterConfigs.length === 0) {
      return { updated: 0, errors: 0 };
    }

    let updated = 0;
    let errors = 0;

    for (const config of counterConfigs) {
      try {
        const channel = guild.channels.cache.get(config.channel_id);
        if (!channel) {
          console.log(`   ⚠️ Canal ${config.channel_id} introuvable, désactivation...`);
          // Désactiver le counter si le canal n'existe plus
          await supabase
            .from('guild_channel_counters')
            .update({ enabled: false })
            .eq('id', config.id);
          continue;
        }

        // Vérifier que c'est un canal texte
        if (!channel.isTextBased() || channel.isDMBased()) {
          console.log(`   ⚠️ Canal ${channel.name} n'est pas un canal texte valide`);
          continue;
        }

        // Récupérer les stats
        const stats = await getCounterStats(guild.id, config.counter_type, supabase, guild);
        
        // Mettre à jour le counter
        await updateChannelCounter(channel, config.counter_type, stats, supabase, guild.id);
        updated++;
      } catch (error) {
        console.error(`   ❌ Erreur mise à jour counter ${config.channel_id}:`, error.message);
        errors++;
      }
    }

    return { updated, errors };
  } catch (error) {
    console.error('Erreur dans updateAllChannelCounters:', error);
    return { updated: 0, errors: 1 };
  }
}

/**
 * Crée un nouveau channel counter
 */
export async function createChannelCounter(guildId, channelId, counterType, supabase) {
  // Vérifier si un counter existe déjà pour ce canal
  const { data: existing } = await supabase
    .from('guild_channel_counters')
    .select('*')
    .eq('guild_id', guildId)
    .eq('channel_id', channelId)
    .single();

  if (existing) {
    // Mettre à jour le counter existant
    const { data, error } = await supabase
      .from('guild_channel_counters')
      .update({
        counter_type: counterType,
        enabled: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur mise à jour counter: ${error.message}`);
    }

    return data;
  }

  // Créer un nouveau counter
  const { data, error } = await supabase
    .from('guild_channel_counters')
    .insert({
      guild_id: guildId,
      channel_id: channelId,
      counter_type: counterType,
      enabled: true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur création counter: ${error.message}`);
  }

  return data;
}

/**
 * Supprime un channel counter
 */
export async function deleteChannelCounter(guildId, channelId, supabase) {
  const { error } = await supabase
    .from('guild_channel_counters')
    .update({ enabled: false })
    .eq('guild_id', guildId)
    .eq('channel_id', channelId);

  if (error) {
    throw new Error(`Erreur suppression counter: ${error.message}`);
  }
}

/**
 * Récupère tous les counters d'un serveur
 */
export async function getGuildCounters(guildId, supabase) {
  const { data, error } = await supabase
    .from('guild_channel_counters')
    .select('*')
    .eq('guild_id', guildId)
    .eq('enabled', true);

  if (error) {
    console.error('Erreur récupération counters:', error);
    return [];
  }

  return data || [];
}

