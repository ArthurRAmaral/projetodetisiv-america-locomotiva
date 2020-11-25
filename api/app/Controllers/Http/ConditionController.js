'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Condition = use('App/Models/Condition')
const User = use('App/Models/User')
const { validate } = use('Validator')

/**
 * Resourceful controller for interacting with conditions
 */
class ConditionController {
  /**
   * Show a list of all conditions.
   * GET conditions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const conditions = await Condition.all()

    if (conditions) {
      return conditions;
    }
    return response.notFound()
  }

  /**
   * Create/save a new condition.
   * POST conditions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const data = request.only(['name', 'color'])

    const rules = {
      name: "required|string",
      color: "required|string",
    };

    const validation = await validate(data, rules);

    if (validation.fails())
      return response.unprocessableEntity(validation.messages());

    try {
      await Condition.create(data);
    } catch {
      return response.conflict();
    }
    return response.created();
  }

  /**
   * Display a single condition.
   * GET conditions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {

    const { id } = params

    const condition = await Condition.query().where({ id }).with('users').first()

    if (condition) {
      return condition
    }

    return response.notFound()
  }

  /**
   * Update condition details.
   * PUT or PATCH conditions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const { id } = params

    const data = request.only(['name', 'color'])

    const rules = {
      name: "required|string",
      color: "required|string",
    };

    const validation = await validate(data, rules);

    if (validation.fails())
      return response.unprocessableEntity(validation.messages());

    const condition = await Condition.find(id)

    if (condition) {
      try {
        condition.merge(data);
        await condition.save();
      } catch {
        return response.conflict();
      }
      return response.json(condition.toJSON());
    } else {
      return response.notFound()
    }
  }

  /**
   * Delete a condition with id.
   * DELETE conditions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const { id } = params

    const deletedCondition = await Condition.query().where({ id }).delete();

    if (deletedCondition) {
      return response.noContent();
    }

    return response.notFound()
  }

  /**
   * Subscribe a user to a condition.
   * POST conditions/:condition_id/subscribe/:user_id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async subscribe({ params, response }) {
    const { condition_id, user_id } = params

    const condition = await Condition.find(condition_id)
    const user = await User.find(user_id)

    if (condition && user) {
      await condition.users().save(user)
      return response.send()
    }

    return response.notFound()
  }
}

module.exports = ConditionController
