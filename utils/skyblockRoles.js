// utils/skyblockRoles.js

const skyblockLevelRoles = [
  { min: 1, max: 39, roleId: 'ROLE_ID_1' },
  { min: 40, max: 79, roleId: 'ROLE_ID_2' },
  { min: 80, max: 119, roleId: 'ROLE_ID_3' },
  { min: 120, max: 159, roleId: 'ROLE_ID_4' },
  { min: 160, max: 199, roleId: 'ROLE_ID_5' },
  { min: 200, max: 239, roleId: 'ROLE_ID_6' },
  { min: 240, max: 279, roleId: 'ROLE_ID_7' },
  { min: 280, max: 319, roleId: 'ROLE_ID_8' },
  { min: 320, max: 359, roleId: 'ROLE_ID_9' },
  { min: 360, max: 399, roleId: 'ROLE_ID_10' },
  { min: 400, max: 479, roleId: 'ROLE_ID_11' },
  { min: 480, max: 500, roleId: 'ROLE_ID_12' }
];

async function applySkyblockLevelRole(member, sbLevel) {
  const levelBracket = skyblockLevelRoles.find(b => sbLevel >= b.min && sbLevel <= b.max);
  if (!levelBracket) return;

  const currentBracketRoleIds = skyblockLevelRoles.map(b => b.roleId);
  const rolesToRemove = member.roles.cache.filter(role => currentBracketRoleIds.includes(role.id));

  try {
    await member.roles.remove(rolesToRemove);
    await member.roles.add(levelBracket.roleId);
    console.log(`🌟 Applied SB role ${levelBracket.roleId} for level ${sbLevel}`);
  } catch (err) {
    console.error('❌ Error updating SB level role:', err);
  }
}

module.exports = {
  applySkyblockLevelRole,
  skyblockLevelRoles
};