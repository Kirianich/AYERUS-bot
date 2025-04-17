const { applySkyblockLevelRole, skyblockLevelRole } = require('./skyblockRoles');
const Hypixel = require('hypixel-api-reborn');
const User = require('../models/User');
const GuildSettings = require('../models/GuildSettings');
const formatNickname = require('./formatNickname');

const hypixel = new Hypixel.Client(process.env.HYPIXEL_API_KEY);

class Updater {

  async updateUser(interaction) {
    const discordId = interaction.user.id;
    const guildId = interaction.guild.id;

    const member = interaction.guild.members.cache.get(discordId);
    if (!member) return interaction.reply({ content: '❌ Пользователь не найден на сервере.', ephemeral: true });

    const userData = await User.findOne({ discordId });
    if (!userData || !userData.minecraftUuid) {
      return interaction.reply({ content: '❌ Вы не верифицированы. Используйте соответствующую кнопку.', ephemeral: true });
    }

    try {
      const player = await hypixel.getPlayer(userData.minecraftUuid, { guild: true });
      const networkRank = player.rank || 'NONE';
      const username = player.nickname;
      const guild = player.guild || null;
      const userGuildRank = guild?.members?.find(m => m.uuid === player.uuid)?.rank || null;

      // Skyblock level from selected profile
      const sbProfiles = await hypixel.getSkyblockMember(player.uuid);
      const selected = [...sbProfiles.values()].find(p => p.selected);
      const sbLevel = Math.floor(selected?.level || 0);

      const updatedFields = {
        networkRank,
        username,
        guild: {
          id: guild?.id || null,
          name: guild?.name || null,
          rank: userGuildRank
        },
        skyblockLevel: sbLevel
      };

      await User.findOneAndUpdate({ discordId }, updatedFields);

      // SkyBlock Level Role Assignment
      if (sbLevel !== null) {
        const roleId = skyblockLevelRole(sbLevel);
        const allBracketRoles = skyblockLevelRole();

        // Remove any previously assigned bracket role
        for (const existingRoleId of allBracketRoles) {
          if (member.roles.cache.has(existingRoleId)) {
            await member.roles.remove(existingRoleId);
          }
        }

        // Assign new role
        const levelRole = guild.roles.cache.get(roleId);
        if (levelRole) {
          await member.roles.add(levelRole);
          console.log(`📊 Updated SkyBlock level role: ${roleId}`);
        } else {
          console.warn(`⚠️ SkyBlock level role ID "${roleId}" not found in cache`);
        }
      }


      // Now handle role/nickname updates
      const settings = await GuildSettings.findOne({ discordGuildId: guildId });
      if (!settings) throw new Error('⚙️ Настройки сервера не найдены');

      const updates = [];

      // Network Rank role
      const rankRoleId = settings.roles?.networkRankRoles?.[networkRank];
      if (rankRoleId) updates.push(member.roles.add(rankRoleId));

      // Guild roles
      const matchedGuild = settings.linkedGuilds?.find(g => g.hypixelGuildId === guild?.id);
      if (matchedGuild) {
        const guildMemberRole = matchedGuild.roles?.guildMemberRole;
        const rankIndex = matchedGuild.guildRanks?.findIndex(r => r === userGuildRank);
        const rankRoleId = matchedGuild.roles?.rankRoles?.[`rank${rankIndex + 1}`];

        if (guildMemberRole) updates.push(member.roles.add(guildMemberRole));
        if (rankRoleId) updates.push(member.roles.add(rankRoleId));
      }

      // Nickname
      const nickname = formatNickname(settings.nicknameFormat, {
        username,
        networkRank,
        sbLevel
      });

      const shouldChangeNick = !member.roles.cache.some(role => settings.nicknameSettings?.ignoredRoles?.includes(role.id));
      if (shouldChangeNick && member.manageable) {
        updates.push(member.setNickname(nickname));
      }

      await Promise.all(updates);

      return interaction.reply({ content: '✅ Данные обновлены.', ephemeral: true });

    } catch (error) {
      console.error('❌ Error updating user:', error);
      return interaction.reply({ content: '⚠️ Не удалось обновить данные. Попробуйте позже.', ephemeral: true });
    }
  }
}

module.exports = Updater;
