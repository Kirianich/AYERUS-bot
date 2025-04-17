// utils/skyblockRoles.js
const skyblockLevelRoles = [
  { min: 1, max: 39, roleId: '1362415393926283426' },
  { min: 40, max: 79, roleId: '1362415669362167949' },
  { min: 80, max: 119, roleId: '1362415913151889418' },
  { min: 120, max: 159, roleId: '1362416163639791769' },
  { min: 160, max: 199, roleId: '1362416278404469098' },
  { min: 200, max: 239, roleId: '1362416415940018267' },
  { min: 240, max: 279, roleId: '1362416531820118289' },
  { min: 280, max: 319, roleId: '1362416718940733620' },
  { min: 320, max: 359, roleId: '1362416876139053118' },
  { min: 360, max: 399, roleId: '1362417029675745281' },
  { min: 400, max: 439, roleId: '1362417128388694166' },
  { min: 440, max: 479, roleId: '1362417277290414080' },
  { min: 480, max: 500, roleId: '1362417390058733589' }
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
