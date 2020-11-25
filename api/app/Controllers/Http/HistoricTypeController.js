'use strict'
const { validate } = use('Validator')

const HistoricType = use('App/Models/HistoricType')
const HistoricItem = use('App/Models/HistoricItem')
const User = use('App/Models/User')

class HistoricTypeController {
  async index({ response }) {
    const historicType = await HistoricType.all()
    return response.json(historicType.toJSON())
  }

  async retrive({ params, response }) {
    const rules = {
      id: 'required|integer',
    }
    const validation = await validate(params, rules)
    if (validation.fails()) return response.badRequest(validation.messages())

    const { id } = params

    const historicType = await HistoricType.find(id)

    return response.json(historicType)
  }

  async store({ request, response }) {
    const data = request.only(['type', 'description', 'color'])
    const rules = {
      type: 'required|string',
      description: 'required|string',
      color: 'required|string',
    }

    const validation = await validate(data, rules)

    if (validation.fails()) return response.badRequest(validation.messages())

    try {
      data.color = data.color.toUpperCase()
      return response.status(201).json(await HistoricType.create(data))
    } catch (e) {
      return response.conflict(e)
    }
  }

  async update({ request, params, response }) {
    const { id } = params

    const data = request.only(['type', 'description', 'color'])

    const rules = {
      id: 'required|integer',
      type: 'string',
      description: 'string',
      color: 'string',
    }

    const validation = await validate({ id, ...data }, rules)

    if (validation.fails()) return response.badRequest(validation.messages())

    const historicType = await HistoricType.find(id)

    if (historicType) {
      try {
        data.color = data.color.toUpperCase()
        historicType.merge(data)
        await historicType.save()
      } catch (e) {
        return response.conflict(e.message())
      }
      return response.json(historicType)
    } else {
      return response.badRequest()
    }
  }

  async delete({ params, response }) {
    const rules = {
      id: 'required|integer',
    }

    const validation = await validate(params, rules)
    if (validation.fails()) return response.badRequest(validation.messages())

    const { id } = params

    const deleted = await HistoricType.query().where({ id }).delete()

    if (deleted) {
      return response.noContent()
    }
    return response.notFound()
  }

  async retriveUsers({ params, response }) {
    const rules = {
      id: 'required|integer',
    }
    const validation = await validate(params, rules)

    if (validation.fails()) return response.badRequest(validation.messages())

    const { id } = params

    const subquery = await HistoricType.query()
      .join(
        'historic_items',
        'historic_types.id',
        '=',
        'historic_items.historic_type_id'
      )
      .distinct('user_id as id')
      .where('historic_types.id', id)
      .fetch()

    const usersIds = subquery.rows.map((user) => user.$attributes.id)

    const users = await User.query().whereIn('id', usersIds).fetch()
    return response.json(users)
  }
}

module.exports = HistoricTypeController
