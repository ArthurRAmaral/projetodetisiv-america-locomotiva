const chance = require('chance')
const moment = require('moment')

class Token {
  register(Model) {
    Model.createPasswordRecoveryToken = async function (userId) {
      const token = await Model.create({
        user_id: userId,
        type: 'password_recovery',
        token: chance().guid(),
        expires_at: moment().add(2, 'hours'),
      })
      return token
    }

    Model.verifyResetPasswordToken = function (token) {
      return token && !token.is_revoked && moment().isBefore(token.expires_at)
    }

    Model.generateForUser = async function (user, auth) {
      // load permissions
      await user.loadMany({
        // application level permissions
        group: (group) => group.with('permissions'),
        // team level permissions
        roles: (role) => {
          role.with('team')
          role.with('permissions')
        },
      })

      const token = await auth.generate(user, { user: user.toJSON() })
      return token
    }
  }
}

module.exports = Token
