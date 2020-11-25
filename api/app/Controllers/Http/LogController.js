/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('../../Models/Log')} */
const Log = use('App/Models/Log')

/** @type {typeof import('../../Models/Team')} */
const Team = use('App/Models/Team')

/** @type {typeof import('../../Models/LogType')} */
const LogType = use('App/Models/LogType')

/** @type {typeof import('../../Models/User')} */
const User = use('App/Models/User')

/** @type {require('@adonisjs/validator/src/Validator/index').validate} */
const { validate } = use('Validator')

class LogController {
  /**
   * Show a list of all events available on system.
   * GET events
   *
   * @param {object} ctx
   * @param {Response} ctx.request
   * @param {Response} ctx.response
   */
  async index({ response }) {
    const logs = await Log.query().with('logType').withCount('teams').withCount('users').fetch()
    if (logs) return response.json(logs.toJSON())
    return response.badRequest()
  }

  /**
   *
   * @param {object} ctx
   * @param {Response} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const data = request.only(['name', 'start_date', 'end_date', 'comments'])
    const { teams, logType, users } = request.only(['teams', 'logType', 'users'])

    const rules = {
      name: 'required|string',
      start_date: 'required|date',
      end_date: 'date',
      comments: 'string',
      teams: 'array',
      users: 'required|array',
      logType: 'required|integer',
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) return response.unprocessableEntity(validation.messages())

    const log = Object.assign(new Log(), data)
    await log.logType().associate(await LogType.find(logType))

    await log.save()

    await log.users().attach(users)
    await log.teams().attach(teams)

    return response.created()
  }

  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async show({ params, response }) {
    const rules = {
      id: 'required|integer',
    }

    const validation = await validate(params, rules)

    if (validation.fails()) return response.unprocessableEntity(validation.messages())

    const { id } = params

    const log = await Log.query()
      .with('users', (table) => {
        table.with('teams')
        table.where('active', true)
      })
      .with('teams', (table) => {
        table.with('members.role')
        table.with('members.user')
      })
      .with('logType')
      .where('id', id)
      .where('active', true)
      .firstOrFail()

    if (log) {
      return response.json(log.toJSON())
    }
    return response.notFound()
  }

  /**
   *
   * @param {object} ctx
   * @param {Response} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const rules = {
      id: 'required|integer',
      name: 'required|string',
      start_date: 'required|date',
      end_date: 'date',
      comments: 'string',
      teams: 'array',
      users: 'array',
      logType: 'required|integer',
    }

    const validation = await validate({ ...params, ...request.all() }, rules)

    if (validation.fails()) return response.unprocessableEntity(validation.messages())

    const { id } = params
    const data = request.only(['name', 'start_date', 'end_date', 'comments'])
    const { teams, logType, users } = request.only(['teams', 'logType', 'users'])

    const log = await Log.query()
      .with('users')
      .with('teams')
      .with('logType')
      .where('id', id)
      .where('active', true)
      .firstOrFail()

    if (log) {
      log.merge(data)
      await log.save()

      await log.users().sync([...users])
      await log.teams().sync(teams)

      await log.logType().associate(await LogType.find(logType))

      return response.noContent()
    }
    return response.notFound()
  }

  /**
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const rules = {
      id: 'required|integer',
    }

    const validation = await validate(params, rules)

    if (validation.fails()) return response.unprocessableEntity(validation.messages())

    const { id } = params

    const log = await Log.find(id)

    if (log) {
      log.merge({ active: false })
      await log.save()

      return response.noContent()
    }
    return response.notFound()
  }

  async showUserLog({ params, response }) {
    const rules = {
      id: 'required|integer',
    }

    const validation = await validate(params, rules)

    if (validation.fails()) return response.unprocessableEntity(validation.messages())

    const { id } = params

    const user = await User.query()
      .with('logs', (table) => {
        table.with('logType')
        table.where('active', true)
      })
      .where('id', id)
      .where('active', true)
      .first()

    if (user) {
      const json = user.toJSON().logs
      if (json.length === null) return response.json([json])
      return response.json(json)
    }
    return response.notFound()
  }

  async updateUserLog({ params, request, response }) {
    const rules = {
      log_id: 'required|integer',
      user_id: 'required|integer',
      name: 'required|string',
      justification: 'string',
      points: 'integer',
      presence: 'required|boolean',
    }

    const validation = await validate({ ...params, ...request.all() }, rules)

    if (validation.fails()) return response.unprocessableEntity(validation.messages())

    const { log_id, user_id } = params
    const { name, justification, points, presence } = request.all()

    const log = await Log.query()
      .with('users', (builder) => {
        builder.where('user_id', user_id)
      })
      .where('id', log_id)
      .where('active', true)
      .first()

    if (log) {
      // eslint-disable-next-line camelcase
      await log.users().detach([user_id])
      // eslint-disable-next-line camelcase
      await log.users().attach([user_id], (pivot) => {
        // eslint-disable-next-line no-param-reassign
        pivot.name = name
        // eslint-disable-next-line no-param-reassign
        pivot.justification = justification
        // eslint-disable-next-line no-param-reassign
        pivot.points = points
        // eslint-disable-next-line no-param-reassign
        pivot.presence = presence
      })
      return response.noContent()
    }
    return response.notFound()
  }

  async showTeamLog({ params, response }) {
    const rules = {
      id: 'required|integer',
    }

    const validation = await validate(params, rules)

    if (validation.fails()) return response.unprocessableEntity(validation.messages())

    const { id } = params

    const teamLogs = await Team.query()
      .with('logs', (table) => {
        table.with('logType').withCount('teams').withCount('users')
        table.where('active', true)
      })
      .where('id', id)
      .where('active', true)
      .first()

    if (teamLogs) {
      const json = teamLogs.toJSON().logs
      if (json.length === null) return response.json([json])
      return response.json(json)
    }
    return response.notFound()
  }

  async allLogTypes({ response }) {
    const logTypes = await LogType.all()
    return response.json(logTypes.toJSON())
  }

  async checkPresence({ params, request, response }) {
    const { id } = params
    const data = request.all()
    const { users } = data

    const log = await Log.query().with('users').where('id', id).where('active', true).first()

    if (log) {
      await log.users().detach()
      await log.users().attach(users, (pivot) => {
        pivot.presence = pivot.user_id.presence
        pivot.user_id = pivot.user_id.id
      })
      return response.noContent()
    }
    return response.notFound()
  }
}

module.exports = LogController
