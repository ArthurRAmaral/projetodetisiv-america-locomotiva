/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const chance = require('chance')
const mail = require('../../mail')
const FileStorage = require('../../../services/FileStorage')

/** @type {typeof import('../../Models/User')} */
const User = use('App/Models/User')
const Token = use('App/Models/Token')

/** @type {typeof import('../../Models/Annotation')} */
const Annotation = use('App/Models/Annotation')

const { validate } = use('Validator')

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET user
   *
   * @param {object} ctx
   * @param {Response} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response }) {
    const exact = request.only([
      'active',
      'plan_id',
      'condition_id',
      'email',
      'phone',
      'rg',
      'cpf',
      'group_id',
    ])
    const search = request.only(['fullName', 'nickname'])
    const { teams, birthday } = request.only(['teams', 'birthday'])

    const { field, order, page } = request.all()

    // query
    const query = User.query().where(exact)

    Object.keys(search).forEach((key) => {
      query.andWhere(key, 'ilike', `%${search[key]}%`)
    })

    if (birthday) {
      query.andWhereRaw('EXTRACT(MONTH FROM dob) = ?', birthday)
    }

    if (teams) {
      // exists
      query.whereHas('teams', (team) => {
        team.wherePivot('team_id', 'in', teams.split(','))
      })
    }

    query
      .with('teams')
      .with('plan')
      .with('group')
      .with('condition')
      .orderBy(field || 'created_at', order === 'descend' ? 'desc' : 'asc')

    // fetch
    const users = await query.paginate(page || 1, 20)

    return response.json(users.toJSON())
  }

  /**
   * Search users by name.
   * GET user/search
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async search({ request, response }) {
    const { fullName } = request.qs

    const users = await User.query()
      .where('fullName', 'ilike', `%${fullName}%`)
      .with('roles', (builder) => {
        builder.with('team')
        builder.with('role')
      })
      .orderBy('fullName')
      .paginate(1, 20)
    return response.json(users.toJSON())
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
      'username',
      'email',
      'fullName',
      'phone',
      'nickname',
      'rg',
      'cpf',
      'cep',
      'state',
      'city',
      'neighborhood',
      'street',
      'buildingNumber',
      'complement',
      'weight',
      'height',
      'dob',
      'emergencyName',
      'emergencyPhone',
      'emergencyEmail',
      'emergencyConsanguinity',
      'healthInsurance',
      'sex',
      'plan_id',
      'group_id',
      'condition_id',
    ])

    const generatedPassword = chance().string({
      length: 8,
      alpha: true,
      numeric: true,
      symbols: false,
    })

    let user;

    try {
      user = await User.create({
        ...payload,
        avatarUrl: `https://api.adorable.io/avatars/285/${payload.email}.png`,
        phone: payload.phone && payload.phone.replace(/\D/g, ''),
        emergencyPhone: payload.emergencyPhone && payload.emergencyPhone.replace(/\D/g, ''),
        password: generatedPassword,
        active: true,
        condition_id: 1,
      })
    } catch (error) {
      if (error.code == 23503) {
        return response.internalServerError('Plano selecionado não existe')
      } else if (error.constraint == 'users_username_unique') {
        return response.internalServerError('Email já cadastrado')
      }
      console.log(error)
      return response.internalServerError('Um erro inesperado ocorreu')
    }

    try {
      if (user.plan_id) {
        await user.load('plan')
      }
    } catch (error) {
      await user.delete()
      return response.internalServerError('Não foi possível carregar o plano selecionado')
    }

    // try {
    //   await mail.sendWelcomeMessage({
    //     ...user.toJSON(),
    //     to: user.email,
    //     generatedPassword,
    //   });
    //   return response.created(user.toJSON());
    // } catch (error) {
    //   await user.delete();
    //   return response.internalServerError("Ocorreu um erro ao enviar o email");
    // }
  }

  /**
   * Display a single user.
   * GET user/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    const users = await User.all()
    response.json(users.toJSON())

    const { id } = params

    const user = await User.query()
      .with('roles', (userRole) => {
        userRole.with('role')
        userRole.with('team')
      })
      .with('group')
      .with('payments')
      .with('logs', (build) => {
        build.with('logType')
      })
      .with('annotations')
      .with('plan')
      .with('historic')
      .with('condition')
      .where('id', id)
      .first()

    if (user) {
      return response.json(user.toJSON())
    }
    return response.notFound()
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
      'username',
      'fullName',
      'phone',
      'nickname',
      'rg',
      'cpf',
      'cep',
      'state',
      'city',
      'neighborhood',
      'street',
      'buildingNumber',
      'complement',
      'weight',
      'height',
      'dob',
      'emergencyName',
      'emergencyPhone',
      'emergencyEmail',
      'emergencyConsanguinity',
      'healthInsurance',
      'sex',
      'plan_id',
      'group_id',
      'condition_id',
    ])

    const user = await User.find(id)

    if (user) {
      user.merge({
        ...payload,
        phone: payload.phone && payload.phone.replace(/\D/g, ''),
        emergencyPhone: payload.emergencyPhone && payload.emergencyPhone.replace(/\D/g, ''),
      })
      await user.save()
      return response.status(200).send()
    }

    return response.status(404).send()
  }

  /**
   * Delete a user with id.
   * DELETE user/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const { id } = params
    const user = await User.find(id)

    if (user) {
      user.active = false
      await user.save()
      return response.status(200).send()
    }

    return response.status(404).send()
  }

  /**
   * Delete a user with id.
   * POST user/restore/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async restore({ params, response }) {
    const { id } = params
    const user = await User.find(id)

    if (user) {
      user.active = true
      await user.save()
      return response.status(200).send('OK')
    }

    return response.status(404).send('OK')
  }

  /**
   * Update the user password
   * POST user/:id/change-password
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async changePassword({ params, request, response, auth }) {
    const { id } = params
    const { currentPassword, password } = request.body

    const user = await User.find(id)

    if (user) {
      const verified = await auth.attempt(user.email, currentPassword)

      if (verified) {
        user.password = password
        await user.save()

        const token = await Token.generateForUser(user, auth)

        return response.status(200).send(token)
      }
    }
    return response.status(400).send('Bad Request')
  }

  /**
   * Create/save a new annotation.
   * POST annotation
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async storeAnnotation({ params, request, response }) {
    const rules = {
      id: 'required|integer',
      annotation: 'required|string',
    }

    const validation = await validate({ ...params, ...request.all() }, rules)

    if (validation.fails()) return response.unprocessableEntity(validation.messages())

    const { id } = params
    const data = request.only(['annotation'])

    const annotation = Object.assign(new Annotation(), { ...data })

    const user = await User.find(id)

    if (user) {
      await user.annotations().save(annotation)
      return response.created(annotation.toJSON())
    }
    return response.notFound()
  }

  /**
   * Update/edit a annotation.
   * UPDATE annotation
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async updateAnnotation({ params, request, response }) {
    const rules = {
      user_id: 'required|integer',
      annotation_id: 'required|integer',
      annotation: 'required|string',
    }

    const validation = await validate({ ...params, ...request.all() }, rules)

    if (validation.fails()) return response.unprocessableEntity()

    const { user_id, annotation_id } = params
    const data = request.only(['annotation'])

    const annotation = await Annotation.query().where({ id: annotation_id, user_id }).first()

    if (annotation) {
      annotation.merge(data)
      await annotation.save()
      return response.ok(annotation.toJSON())
    }
    return response.notFound()
  }

  async destroyAnnotation({ params, response }) {
    const rules = {
      user_id: 'required|integer',
      annotation_id: 'required|integer',
    }

    const validation = await validate(params, rules)

    if (validation.fails()) return response.unprocessableEntity()

    const { user_id, annotation_id } = params

    const deleted = await Annotation.query()
      .where({
        id: annotation_id,
        user_id,
      })
      .delete()

    if (deleted) {
      return response.noContent()
    }
    return response.notFound()
  }

  /**
   * POST /user/self/avatar
   * Store a picture file for the authenticated user and returns the uploaded file location url and the new JWT token
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Request} ctx.request
   */
  async uploadAvatar({ request, response, auth }) {
    const user = await auth.getUser()

    // prepare processing
    request.multipart.file('avatar', {}, async (file) => {
      const { filename, fileUrl } = await FileStorage.store(file, {
        deleteKey: user.avatar,
      })

      // update user
      user.avatar = filename
      user.avatarUrl = fileUrl
      await user.save()
    })

    await request.multipart.process()
    const token = await Token.generateForUser(user, auth)
    return response.json(token)
  }

  /**
   * POST /user/self
   * Updates information for the authenticated user and generates a new JWT token
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Request} ctx.request
   */
  async updateSelf({ response, request, auth }) {
    const payload = request.only([
      'username',
      'email',
      'fullName',
      'phone',
      'nickname',
      'rg',
      'cpf',
      'cep',
      'state',
      'city',
      'neighborhood',
      'street',
      'buildingNumber',
      'complement',
      'weight',
      'height',
      'dob',
      'emergencyName',
      'emergencyPhone',
      'emergencyEmail',
      'emergencyConsanguinity',
      'healthInsurance',
      'sex',
    ])

    const user = await auth.getUser()
    user.merge(payload)

    await user.save()

    const token = await Token.generateForUser(user, auth)
    return response.json(token)
  }

  async birthday() {
    const users = await User.query().
      where('active', true).
      andWhereRaw('EXTRACT(MONTH FROM dob) = ?', new Date().getMonth() + 1).
      select('id', 'fullName', 'nickname', 'dob', 'avatar').
      fetch()
    return users
  }

  async todayBirthday() {
    const users = await User.query().
      where('active', true).
      andWhereRaw('EXTRACT(DAY FROM dob) = ?', new Date().getDate()).
      andWhereRaw('EXTRACT(MONTH FROM dob) = ?', new Date().getMonth() + 1).
      select('id', 'fullName', 'nickname', 'dob', 'avatar').
      fetch()
    return users
  }

  async roles() {
    const users = await User.query()
      .select('id', 'fullName', 'nickname')
      .with('roles', (userRole) => {
        userRole.with('role')
        userRole.with('team')
      }).fetch()
    return users
  }

  async ranges() {
    const users = await User.query()
      .select('id', 'fullName', 'dob')
      .fetch()
    return users
  }

}



module.exports = UserController
