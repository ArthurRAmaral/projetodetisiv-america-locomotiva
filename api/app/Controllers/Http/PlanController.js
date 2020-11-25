/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Plan = use('App/Models/Plan')
const User = use('App/Models/User')

/**
 * Resourceful controller for interacting with plans
 */
class PlanController {
  /**
   * Show a list of all plans.
   * GET plans
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ response }) {
    const plans = await Plan.query().with('users').fetch()
    return response.send(plans.toJSON())
  }

  /**
   * Create/save a new plan.
   * POST plans
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const data = request.only(['name', 'monthlyPrice'])
    const plan = await Plan.create(data)
    return response.created(plan.toJSON())
  }

  /**
   * Display a single plan.
   * GET plans/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    const { id } = params

    const plan = await Plan.query().where({ id }).with('users').with('payments').with('payments.user').first()

    if (plan) {
      return plan.toJSON()
    }

    return response.notFound()
  }

  /**
   * Update plan details.
   * PUT or PATCH plans/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const { id } = params
    const data = request.only(['name', 'monthlyPrice'])

    const plan = await Plan.find(id)

    if (plan) {
      plan.merge(data)
      await plan.save()
      return response.send()
    }

    return response.notFound()
  }

  /**
   * Delete a plan with id.
   * DELETE plans/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const { id } = params

    const plan = await Plan.find(id)

    if (plan) {
      plan.active = false
      await plan.save()
      return response.send()
    }

    return response.notFound()
  }

  /**
   * Restore a plan with id.
   * POST plans/:id/restore
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async restore({ params, response }) {
    const { id } = params

    const plan = await Plan.find(id)

    if (plan) {
      plan.active = true
      await plan.save()
      return response.send()
    }

    return response.notFound()
  }

  /**
   * Subscribe a user to a plan.
   * POST plans/:plan_id/subscribe/:user_id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async subscribe({ params, response }) {
    const { plan_id, user_id } = params

    const plan = await Plan.find(plan_id)
    const user = await User.find(user_id)

    if (plan && user) {
      await plan.users().save(user)
      return response.send()
    }

    return response.notFound()
  }
}

module.exports = PlanController
