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
  return brackets?.find(bracket => level >= bracket.min && level <= bracket.max);
}

async function assignSkillRoles(member, skills) {
  for (const [skill, level] of Object.entries(skills)) {
    const bracket = getSkillBracket(skill, level);
    if (!bracket) continue;

    const allRoleIds = skillBrackets[skill].map(b => b.roleId);
    const currentRoles = member.roles.cache.filter(role => allRoleIds.includes(role.id));

    try {
      // Remove all roles for that skill
      for (const role of currentRoles.values()) {
        await member.roles.remove(role);
      }

      // Add new skill role directly by ID
      if (!member.roles.cache.has(bracket.roleId)) {
        await member.roles.add(bracket.roleId);
        console.log(`✅ Assigned ${skill} role ID ${bracket.roleId} for level ${level}`);
      }
    } catch (err) {
      console.error(`❌ Error assigning ${skill} role:`, err);
    }
  }
}

module.exports = {
  assignSkillRoles
};
