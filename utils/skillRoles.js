// utils/skillRoles.js
const skillBrackets = {
  farming: [
    { min: 0, max: 19, roleId: 'ROLE_ID_FARMING_1' },
    { min: 20, max: 39, roleId: 'ROLE_ID_FARMING_2' },
    { min: 40, max: 59, roleId: 'ROLE_ID_FARMING_3' },
  ],
  mining: [
    { min: 0, max: 19, roleId: 'ROLE_ID_MINING_1' },
    { min: 20, max: 39, roleId: 'ROLE_ID_MINING_2' },
    { min: 40, max: 59, roleId: 'ROLE_ID_MINING_3' },
  ],
  combat: [
    { min: 0, max: 19, roleId: 'ROLE_ID_COMBAT_1' },
    { min: 20, max: 39, roleId: 'ROLE_ID_COMBAT_2' },
    { min: 40, max: 59, roleId: 'ROLE_ID_COMBAT_3' },
  ],
  fishing: [
    { min: 0, max: 19, roleId: 'ROLE_ID_FISHING_1' },
    { min: 20, max: 39, roleId: 'ROLE_ID_FISHING_2' },
    { min: 40, max: 59, roleId: 'ROLE_ID_FISHING_3' },
  ],
};

function getSkillBracket(skill, level) {
  const brackets = skillBrackets[skill];
  return brackets.find(bracket => level >= bracket.min && level <= bracket.max);
}

async function assignSkillRoles(guild, member, skills) {
  for (const [skill, level] of Object.entries(skills)) {
    const bracket = getSkillBracket(skill, level);
    if (!bracket) continue;

    const roleToAdd = guild.roles.cache.get(bracket.roleId);
    if (!roleToAdd) continue;

    const allSkillRoleIds = skillBrackets[skill].map(b => b.roleId);
    const currentSkillRoles = member.roles.cache.filter(r => allSkillRoleIds.includes(r.id));

    for (const role of currentSkillRoles.values()) {
      await member.roles.remove(role);
    }

    if (!member.roles.cache.has(roleToAdd.id)) {
      await member.roles.add(roleToAdd);
      console.log(`✅ Assigned ${skill} role ${roleToAdd.name} for level ${level}`);
    }
  }
}

module.exports = {
  assignSkillRoles
};
