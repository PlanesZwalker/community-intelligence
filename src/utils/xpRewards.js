/**
 * Système de récompenses automatiques basées sur le niveau XP
 * Attribue automatiquement des rôles Discord selon le niveau atteint
 */

/**
 * Vérifie et attribue les récompenses de niveau pour un utilisateur
 */
export async function checkAndAwardRewards(userId, guildId, newLevel, guild, supabase) {
  try {
    // Récupérer les récompenses configurées pour ce serveur
    const { data: rewards, error } = await supabase
      .from('guild_xp_rewards')
      .select('*')
      .eq('guild_id', guildId)
      .lte('level', newLevel)
      .order('level', { ascending: false });

    if (error) {
      console.error('Erreur récupération récompenses:', error);
      return { awarded: [], errors: [] };
    }

    if (!rewards || rewards.length === 0) {
      return { awarded: [], errors: [] };
    }

    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) {
      console.log(`   ⚠️ Membre ${userId} introuvable`);
      return { awarded: [], errors: [] };
    }

    const awarded = [];
    const errors = [];

    // Attribuer chaque récompense que l'utilisateur mérite
    for (const reward of rewards) {
      try {
        const role = guild.roles.cache.get(reward.role_id);
        if (!role) {
          console.log(`   ⚠️ Rôle ${reward.role_id} introuvable pour niveau ${reward.level}`);
          continue;
        }

        // Vérifier si l'utilisateur a déjà le rôle
        if (member.roles.cache.has(reward.role_id)) {
          continue; // Déjà attribué
        }

        // Attribuer le rôle
        await member.roles.add(role, `Niveau ${newLevel} atteint (récompense automatique)`);
        awarded.push({
          level: reward.level,
          roleId: reward.role_id,
          roleName: role.name,
        });
        console.log(`   ✅ Rôle "${role.name}" attribué à ${member.user.tag} (niveau ${newLevel})`);
      } catch (error) {
        if (error.code === 50013) {
          console.log(`   ⚠️ Pas de permission pour attribuer le rôle ${reward.role_id}`);
        } else {
          console.error(`   ❌ Erreur attribution rôle ${reward.role_id}:`, error.message);
          errors.push({
            level: reward.level,
            roleId: reward.role_id,
            error: error.message,
          });
        }
      }
    }

    return { awarded, errors };
  } catch (error) {
    console.error('Erreur dans checkAndAwardRewards:', error);
    return { awarded: [], errors: [{ error: error.message }] };
  }
}

/**
 * Retire les récompenses de niveau inférieur si l'utilisateur a atteint un niveau supérieur
 */
export async function removeLowerLevelRewards(userId, guildId, currentLevel, guild, supabase) {
  try {
    // Récupérer les récompenses de niveau inférieur
    const { data: lowerRewards, error } = await supabase
      .from('guild_xp_rewards')
      .select('*')
      .eq('guild_id', guildId)
      .lt('level', currentLevel)
      .order('level', { ascending: false });

    if (error || !lowerRewards || lowerRewards.length === 0) {
      return { removed: [], errors: [] };
    }

    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) {
      return { removed: [], errors: [] };
    }

    const removed = [];
    const errors = [];

    // Retirer les rôles de niveau inférieur (garder seulement le plus haut niveau)
    for (const reward of lowerRewards) {
      try {
        if (!member.roles.cache.has(reward.role_id)) {
          continue; // L'utilisateur n'a pas ce rôle
        }

        const role = guild.roles.cache.get(reward.role_id);
        if (!role) {
          continue;
        }

        // Retirer le rôle
        await member.roles.remove(role, `Niveau ${currentLevel} atteint (remplacement automatique)`);
        removed.push({
          level: reward.level,
          roleId: reward.role_id,
          roleName: role.name,
        });
        console.log(`   🔄 Rôle "${role.name}" retiré de ${member.user.tag} (niveau ${currentLevel})`);
      } catch (error) {
        if (error.code !== 50013) { // Ignorer les erreurs de permission
          errors.push({
            level: reward.level,
            roleId: reward.role_id,
            error: error.message,
          });
        }
      }
    }

    return { removed, errors };
  } catch (error) {
    console.error('Erreur dans removeLowerLevelRewards:', error);
    return { removed: [], errors: [] };
  }
}

/**
 * Vérifie et met à jour toutes les récompenses pour un utilisateur
 */
export async function updateUserRewards(userId, guildId, currentLevel, guild, supabase) {
  // Attribuer les nouvelles récompenses
  const { awarded, errors: awardErrors } = await checkAndAwardRewards(
    userId,
    guildId,
    currentLevel,
    guild,
    supabase
  );

  // Optionnel : retirer les récompenses de niveau inférieur
  // (décommenter si vous voulez que seul le plus haut niveau soit actif)
  // const { removed, errors: removeErrors } = await removeLowerLevelRewards(
  //   userId,
  //   guildId,
  //   currentLevel,
  //   guild,
  //   supabase
  // );

  return {
    awarded,
    errors: awardErrors,
  };
}

