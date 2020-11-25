/** @type {typeof import('../../Models/User')} */
const User = use('App/Models/User')
const Token = use('App/Models/Token')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class AuthController {
  async authenticate({ request, response, auth }) {
    const { email, password } = request.all()

    const user = await User.query().where({ email }).first()

    if (user && user.active) {
      const passwordCheck = await Hash.verify(password, user.password)

      if (passwordCheck) {
        const token = await Token.generateForUser(user, auth)
        return response.send(token)
      }
    }

    return response.status(401).send()
  }

  async refresh({ response, auth }) {
    const user = await auth.getUser()
    const token = await Token.generateForUser(user, auth)
    return response.json(token)
  }
}

module.exports = AuthController
