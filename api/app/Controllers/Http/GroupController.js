/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('../../Models/Group')} */
const Group = use('App/Models/Group')

/** @type {require('@adonisjs/validator/src/Validator/index').validate} */
const { validate } = use('Validator')

class GroupController {
  /**
   * Show a list of all permissions available on system.
   * GET permissions
   *
   * @param {object} ctx
   * @param {Response} ctx.request
   * @param {Response} ctx.response
   */
  async index({ response }) {
    const groups = await Group.query().where({ type: 'application' }).with('permissions').fetch()
    if (groups) {
      return response.json(groups.toJSON())
    }
    return response.notFound()
  }

  /**
   *
   * @param {object} ctx
   * @param {Response} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const data = request.only(['name', 'description'])
    const { permission_id } = request.only(['permission_id'])

    const rules = {
      name: 'required|string',
      description: 'required|string',
      permission_id: 'required|array',
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) return response.unprocessableEntity()

    const group = await Group.create(data)

    await group.permissions().attach(permission_id)

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

    // group.permissions = await group.permissions().fetch()
    const validation = await validate(params, rules)

    if (validation.fails()) return response.unprocessableEntity()

    const { id } = params

    const group = await Group.find(id)

    if (group) {
      await group.load('permissions')
      return response.json(group.toJSON())
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
    const { id } = params
    const data = request.only(['name', 'description'])
    const { permission_id: permissions } = request.only(['permission_id'])

    const rules = {
      id: 'required|integer',
      name: 'required|string',
      description: 'required|string',
      permission_id: 'array',
    }

    const validation = await validate({ ...params, ...request.all() }, rules)

    if (validation.fails()) return response.unprocessableEntity()

    const group = await Group.find(id)

    if (group) {
      group.merge(data)
      await group.save()

      if (permissions) {
        await group.permissions().sync(permissions)
      }

      return response.send()
    }

    return response.notFound()
  }

  /**
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

    const group = await Group.find(id)

    if (group) {
      await group.delete()
      return response.send()
    }
    return response.notFound()
  }
}

module.exports = GroupController
