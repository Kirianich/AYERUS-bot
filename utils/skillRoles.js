// utils/skillRoles.js

module.exports = {
  skillRoleMap: {
    farming: [
      { min: 0, max: 19, roleId: 'ROLE_ID_FARMING_1' },
      { min: 20, max: 39, roleId: 'ROLE_ID_FARMING_2' },
      { min: 40, max: 59, roleId: 'ROLE_ID_FARMING_3' },
      { min: 60, max: 100, roleId: 'ROLE_ID_FARMING_4' }
    ],
    mining: [
      { min: 1, max: 32, roleId: '1362747709924049059' },
      { min: 3, max: 49, roleId: '1362747922571198545' },
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
  },

  getSkillRole(skillName, level) {
    const roleMap = this.skillRoleMap[skillName];
    if (!roleMap) return null;

    const match = roleMap.find(bracket => level >= bracket.min && level <= bracket.max);
    return match ? match.roleId : null;
  }
};
