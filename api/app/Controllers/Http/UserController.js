const chance = require('chance')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('../../Models/User')} */
const User = use('App/Models/User')

/** @typedef {import('@adonisjs/mail/src/Mail')} Mail */
const Mail = use('Mail')

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET user
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response }) {
    const users = await User.all()
    return users
  }

  /**
   * Create/save a new user.
   * POST user
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const payload = request.only([
      'username', 'email', 'nomeCompleto', 'avatar',
      'telefone', 'apelido', 'rg', 'cpf',
      'cep', 'estado', 'cidade', 'bairro',
      'endereco', 'numero', 'complemento', 'peso',
      'altura', 'dataNasc', 'nomeResponsavel', 'telefoneResponsavel',
      'emailResponsavel', 'grauParentescoResponsavel', 'planoSaude', 'sexo',
    ])

    const generatedPassword = chance().string({
      length: 8,
      alpha: true,
      numeric: true,
      symbols: false,
    })

    const user = await User.create({
      ...payload,
      password: generatedPassword,
      active: true
    })

    try {
      await Mail.send('Emails.password', { ...user.toJSON(), generatedPassword }, (message) => {
        message
          .from('kyouko@gmail.com')
          .to(payload.email)
          .subject('Sistema online do América Locomotiva')
      })

      response.status(201)

      return user.toJSON()
    } catch (error) {
      response.status(500)
      await user.delete()
    }
  }

  /**
   * Display a single user.
   * GET user/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response }) {
    const { id } = params

    const user = await User.find(id)

    if (user) {
      response.json(user.toJSON())
    } else {
      response.status(404).send()
    }
  }

  /**
   * Update user details.
   * PUT or PATCH user/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const { id } = params

    const payload = request.only([
      'username', 'email', 'nomeCompleto', 'avatar',
      'telefone', 'apelido', 'rg', 'cpf',
      'cep', 'estado', 'cidade', 'bairro',
      'endereco', 'numero', 'complemento', 'peso',
      'altura', 'dataNasc', 'nomeResponsavel', 'telefoneResponsavel',
      'emailResponsavel', 'grauParentescoResponsavel', 'planoSaude', 'sexo',
    ])

    const user = await User.find(id)

    if (user) {
      user.merge(payload)
      await user.save()
      response.status(200).send()
    } else {
      response.status(404).send()
    }
  }

  /**
   * Delete a user with id.
   * DELETE user/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const { id } = params
    const user = await User.find(id)

    if (user) {
      user.active = false
      await user.save()
      response.status(200).send()
    } else {
      response.status(404).send()
    }
  }

  /**
   * Delete a user with id.
   * POST user/restore/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async restore({ params, request, response }) {
    const { id } = params
    const user = await User.find(id)

    if (user) {
      user.active = true
      await user.save()
      response.status(200).send()
    } else {
      response.status(404).send()
    }
  }
}

module.exports = UserController
