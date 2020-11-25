/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const mail = require('../../mail')

const Token = use('App/Models/Token')
const User = use('App/Models/User')

const Env = use('Env')

class ForgotPasswordController {
  /**
   * Generates a link with a password recovery request token and send it via e-mail
   *
   * POST forgot-password/request/:email
   *
   * @param {object} ctx
   * @param {{ email: string }} ctx.params
   * @param {Response} ctx.response
   */
  async request({ params, response }) {
    const { email } = params
    const user = await User.findBy('email', email)

    if (!user) {
      return response.status(400).send('Invalid user e-mail')
    }

    const token = await Token.createPasswordRecoveryToken(user.id)

    try {
      await mail.sendPasswordRecoveryRequestMessage({
        ...user.toObject(),
        to: user.email,
        url: `${Env.get('CLIENT_URL')}/reset-password/${token.token}`,
      })
    } catch (error) {
      return response.status(500).send('Could not send recovery e-mail')
    }

    return response.send('Recovery message sent')
  }

  /**
   * Changes user password.
   *
   * A valid `password_recovery` type token must be submitted in order to complete this action.
   *
   * POST forgot-password/reset
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async reset({ request, response }) {
    const { password, token } = request.body

    if (!password) {
      return response.status(400).send('Invalid password')
    }

    // Verify token
    const recoveryToken = await Token.findBy('token', token)

    const isValid = Token.verifyResetPasswordToken(recoveryToken)

    if (!isValid) {
      return response.status(400).send('Invalid token')
    }

    // Update user
    const user = await User.find(recoveryToken.user_id)
    user.password = password
    await user.save()

    // Revoke all `password_recovery` type tokens for this user
    await Token.query()
      .where({ type: 'password_recovery', user_id: user.id })
      .update({ is_revoked: true })

    return response.send('OK')
  }

  /**
   * Verify if a given `password_recovery` type token is valid.
   *
   * GET forgot-password/verify/:token
   *
   * @param {object} ctx
   * @param {{ token: string }} ctx.params
   * @param {Response} ctx.response
   */
  async verify({ params, response }) {
    const { token } = params

    const recoveryToken = await Token.findBy('token', token)

    const isValid = Token.verifyResetPasswordToken(recoveryToken)

    if (!isValid) {
      return response.status(400).send('Invalid token')
    }

    return response.send('OK')
  }
}

module.exports = ForgotPasswordController
