/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const FileStorage = require('../../../services/FileStorage')

const Env = use('Env')

/** @type {typeof import('../../Models/Team')} */
const Team = use('App/Models/Team')

/** @type {typeof import('../../Models/User')} */
const User = use('App/Models/User')

/** @type {typeof import('../../Models/Group')} */
const Group = use('App/Models/Group')

/** @type {typeof import('../../Models/UserTeam')} */
const UserTeam = use('App/Models/UserTeam')

const { validate } = use('Validator')

/**
 * Resourceful controller for interacting with teams
 */
class TeamController {
  /**
   * Show a list of all teams.
   * GET teams
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async index({ response }) {
    const teams = await Team.query()
      .with('members', (builder) => {
        builder.with('role')
        builder.with('user')
      })
      .with('logs')
      .fetch()
    return response.json(teams.toJSON())
  }

  /**
   * Create/save a new team.
   * POST teams
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const data = request.only(['name', 'description'])

    const rules = {
      name: 'required|string',
      description: 'required|string',
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.unprocessableEntity()
    }

    const team = await Team.create({
      ...data,
      imageUrl: `${Env.get('APP_URL')}/image/no-image.png`,
    })

    return response.status(201).json(team.toJSON())
  }

  /**
   * Display a single team.
   * GET teams/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async show({ params, response }) {
    const rules = {
      id: 'required|integer',
    }

    const validation = await validate(params, rules)

    if (validation.fails()) return response.unprocessableEntity()

    const { id } = params

    const team = await Team.query()
      .with('members', (role) => {
        role.with('role')
        role.with('user')
      })
      .where({ id })
      .first()

    if (team) {
      return response.json(team)
    }
    return response.notFound()
  }

  /**
   * Show a list of all teams with members.
   * GET teams
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async showTeamListWithMembers({ response }) {
    const teams = await Team.query()
      .with('members', (builder) => {
        builder.with('role')
        builder.with('user')
      })
      .select('id', 'name')
      .fetch()
    return response.json(teams.toJSON())
  }

  /**
   * Update team details.
   * PUT or PATCH teams/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const { id } = params
    const data = request.only(['name', 'description'])

    const rules = {
      id: 'required|integer',
      name: 'required|string',
      description: 'required|string',
    }

    const validation = await validate({ id, ...data }, rules)

    if (validation.fails()) return response.unprocessableEntity()

    const team = await Team.find(id)

    if (team) {
      team.merge(data)
      await team.save()
      return response.json(team.toJSON())
    }

    return response.notFound()
  }

  /**
   * Set a team to inactive.
   * DELETE teams/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const { id } = params

    const rules = {
      id: 'required|integer',
    }

    const validation = await validate(params, rules)

    if (validation.fails()) return response.unprocessableEntity()

    const team = await Team.find(id)

    if (team) {
      team.merge({ active: false })
      await team.save()

      return response.json(team.toJSON())
    }
    return response.notFound()
  }

  /**
   * Set a team to active.
   * PUT teams/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async restore({ params, response }) {
    const { id } = params

    const rules = {
      id: 'required|integer',
    }

    const validation = await validate(params, rules)

    if (validation.fails()) return response.unprocessableEntity()

    const team = await Team.find(id)

    if (team) {
      team.merge({ active: true })
      await team.save()

      return response.json(team.toJSON())
    }
    return response.notFound()
  }

  /**
   * Enroll users in a team.
   * POST team/:team_id/member/:user_id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async addMember({ params, request, response }) {
    const { team_id, user_id } = params
    const { group_id } = request.only(['group_id'])

    const rules = {
      team_id: 'required|integer',
      user_id: 'required|integer',
      group_id: 'required|integer',
    }

    const validation = await validate({ user_id, team_id, group_id }, rules)

    if (validation.fails()) {
      return response.unprocessableEntity()
    }

    const user = await User.find(user_id)
    const team = await Team.find(team_id)
    const group = await Group.find(group_id)

    if (user && team && group) {
      const userTeam = await UserTeam.create({
        user_id: user.id,
        team_id: team.id,
        group_id: group.id,
      })

      await userTeam.loadMany(['role', 'user'])

      return response.send(userTeam.toJSON())
    }
    return response.notFound()
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async addManyMembers({ params, request, response }) {
    const { team_id } = params
    const members = Object.values(request.body)

    const team = await Team.find(team_id)

    if (team) {
      await UserTeam.createMany(
        members.map((user) => ({
          team_id,
          user_id: user.id,
          group_id: user.groupId,
        }))
      )

      const userIds = members.map((u) => u.id)

      const userRoles = await UserTeam.query()
        .where({ team_id })
        .whereIn('user_id', userIds)
        .with('role')
        .with('user')
        .fetch()

      return response.send(userRoles.toJSON())
    }
    return response.notFound()
  }

  /**
   * GET team/roles
   */
  async roles() {
    const groups = await Group.query().where({ type: 'team' }).fetch()
    return groups.toJSON()
  }

  /**
   * Delete enroll between users and team.
   * DELETE team/:team_id/member/:user_id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async deleteMember({ params, response }) {
    const { team_id, user_id } = params

    const rules = {
      team_id: 'required|integer',
      user_id: 'required|integer',
    }

    const validation = await validate(params, rules)

    if (validation.fails()) {
      return response.unprocessableEntity()
    }

    const deleted = await UserTeam.query()
      .where({
        team_id,
        user_id,
      })
      .delete()

    if (deleted) return response.noContent()
    return response.notFound()
  }

  /**
   * POST /team/:team_id/picture
   * Stores a picture file for the team and returns the uploaded file location url
   * @param {object} ctx
   * @param {{ team_id: string }} ctx.params
   * @param {Response} ctx.response
   * @param {Request} ctx.request
   */
  async uploadImage({ params, request, response }) {
    const { team_id } = params
    const team = await Team.find(team_id)

    if (!team) {
      return response.notFound()
    }

    // prepare processing
    request.multipart.file('image', {}, async (file) => {
      // store
      const { filename, fileUrl } = await FileStorage.store(file)

      // update team
      team.image = filename
      team.imageUrl = fileUrl

      await team.save()
    })

    await request.multipart.process()
    return response.json({ imageUrl: team.imageUrl })
  }
}

module.exports = TeamController
