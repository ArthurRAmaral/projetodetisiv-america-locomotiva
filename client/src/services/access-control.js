module.exports = {
  /**
   * Verifica se o usuário tem a permissão requerida
   * @param {User} user Usuário
   * @param {string} permissionName Propriedade `name` da permissão
   * @param {number} teamId Id do time que o usuário deve ter a permissão, se for o caso
   */
  userHasPermission(user, permissionName, teamId) {
    // user is admin
    if (user.group_id === 1) {
      return true
    }

    if (teamId) {
      if (user.roles) {
        const role = user.roles.find(g => g.team_id === Number(teamId))
        if (role && role.permissions) {
          return role.permissions.some(p => p.name === permissionName)
        }
      }
    } else if (user.group && user.group.permissions) {
      return user.group.permissions.some(p => p.name === permissionName)
    }

    return false
  },
  userIs(user, groupName) {
    return user.group && user.group.name === groupName
  },
}
