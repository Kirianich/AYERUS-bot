// utils/skillRoles.js
const skillBrackets = {
  mining: [
    { min: 1, max: 32, roleId: '1362747709924049059' },
    { min: 33, max: 49, roleId: '1362747922571198545' },
    { min: 50, max: 59, roleId: '1362748070235869435' },
    { min: 60, max: 60, roleId: '1362748213391790223' }
  ],
  combat: [
    { min: 1, max: 24, roleId: '1362747127066919004' },
    { min: 25, max: 49, roleId: '1362747263633326211' },
    { min: 50, max: 59, roleId: '1362749077066092717' },
    { min: 60, max: 60, roleId: '1362747511978328207' }
  ],
  fishing: [
    { min: 1, max: 26, roleId: '1362748584298020895' },
    { min: 27, max: 35, roleId: '1362749747089248256' },
    { min: 36, max: 44, roleId: '1362749807965503568' },
    { min: 45, max: 60, roleId: '1362749912130785300' }
  ]
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
