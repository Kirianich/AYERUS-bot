const { applySkyblockLevelRole } = require('./skyblockRoles');
const Hypixel = require('hypixel-api-reborn');
const User = require('../models/User');
const GuildSettings = require('../models/GuildSettings');
const formatNickname = require('./formatNickname');

const hypixel = new Hypixel.Client(process.env.HYPIXEL_API_KEY);

class Updater {

  async updateUser(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const discordId = interaction.user.id;
    const guildId = interaction.guild.id;

    const member = interaction.guild.members.cache.get(discordId);
    if (!member) return interaction.editReply({ content: '❌ Пользователь не найден на сервере.', ephemeral: true });

    const userData = await User.findOne({ discordId });
    if (!userData || !userData.minecraftUuid) {
      return interaction.editReply({ content: '❌ Вы не верифицированы. Используйте соответствующую кнопку.', ephemeral: true });
    }

    try {
      const player = await hypixel.getPlayer(userData.minecraftUuid, { guild: true });
      const networkRank = player.rank || 'NONE';
      const username = player.nickname;
      const guild = player.guild || null;
      const userGuildRank = guild?.members?.find(m => m.uuid === player.uuid)?.rank || null;

      // Skyblock level from selected profile
      const sbProfiles = await hypixel.getSkyblockMember(player.uuid);
      let sbLevel = null;
      let skills = {};
        for (const [profileId, profile] of sbProfiles) {
          if (profile.selected) {
            sbLevel = Math.floor(profile.level);
            console.log("✅ Selected Profile ID:", profileId);
            console.log("🌟 SkyBlock Level:", sbLevel);
            skills = {
              farming: Math.floor(profile.skills.farming?.level || 0),
              mining: Math.floor(profile.skills.mining?.level || 0),
              combat: Math.floor(profile.skills.combat?.level || 0),
              fishing: Math.floor(profile.skills.fishing?.level || 0),
            };
            console.log("🎯 Updated skills:", skills);
            break;
          }
        }

      const updatedFields = {
        networkRank,
        username,
        guild: {
          id: guild?.id || null,
          name: guild?.name || null,
          rank: userGuildRank
        },
        skyblockLevel: sbLevel,
        skills
      };

      await User.findOneAndUpdate({ discordId }, updatedFields);

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

      await applySkyblockLevelRole(member, sbLevel);
      await assignSkillRoles(member, skills);

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

      return interaction.editReply({ content: '✅ Данные обновлены.', ephemeral: true });

    } catch (error) {
      console.error('❌ Error updating user:', error);
      return interaction.editReply({ content: '⚠️ Не удалось обновить данные. Попробуйте позже.', ephemeral: true });
    }
  }
}

module.exports = Updater;
