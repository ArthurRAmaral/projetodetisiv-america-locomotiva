const { test } = use('Test/Suite')('Access Control Service')

const { userHasPermission } = require('../../services/access-control')

test('verificar permissao a nível de aplicação', async ({ assert }) => {
  const name = 'application/user/manage'

  const admin = {
    group_id: 1,
  }

  const manager = {
    group_id: 2,
    group: {
      permissions: [{ name }],
    },
  }

  const user = {
    group_id: 3,
    group: {
      permissions: [{ name: 'another/permission' }],
    },
  }

  assert.isTrue(userHasPermission(admin, name))
  assert.isTrue(userHasPermission(manager, name))
  assert.isFalse(userHasPermission(user, name))
})

test('verificar permissao a nível de times', async ({ assert }) => {
  const name = 'team/members/manage'
  const teamId = 999

  const admin = {
    group_id: 1,
  }

  const manager = {
    roles: [
      {
        team_id: teamId,
        permissions: [{ name }],
      },
    ],
  }

  const emptyPermissions = {
    roles: [{ team_id: teamId }],
  }

  const emptyRoles = {
    roles: [],
  }

  const nullRoles = {
    roles: null,
  }

  const anotherTeam = {
    roles: [
      {
        team_id: 888,
        permissions: [{ name }],
      },
    ],
  }

  assert.isTrue(userHasPermission(admin, name, teamId))
  assert.isTrue(userHasPermission(manager, name, teamId))
  assert.isFalse(userHasPermission(emptyPermissions, name, teamId))
  assert.isFalse(userHasPermission(emptyRoles, name, teamId))
  assert.isFalse(userHasPermission(nullRoles, name, teamId))
  assert.isFalse(userHasPermission(anotherTeam, name, teamId))
})
