const { validate } = use('Validator')

const HistoricItem = use('App/Models/HistoricItem')

class HistoricItemController {
  async fetchAll({ response }) {
    return response.json(await HistoricItem.all())
  }

  async retrivePerUser({ params, request, response }) {
    const { user_id } = params

    let dbRet = HistoricItem.query()

    // if (id) dbRet = dbRet.where({ id });
    if (user_id) dbRet = dbRet.where({ user_id })
    // if (historic_type_id) dbRet = dbRet.where({ historic_type_id });

    return response.json(await dbRet.with('historictype').fetch())
  }

  async store({ request, response }) {
    const data = request.only([
      'user_id',
      'title',
      'description',
      'historic_type_id',
      'start_at',
      'end_at',
    ])

    const rules = {
      user_id: 'required|integer',
      title: 'required|string',
      description: 'required|string',
      historic_type_id: 'required|integer',
      start_at: 'string',
      end_at: 'string',
    }
    const validation = await validate(data, rules)
    if (validation.fails()) return response.unprocessableEntity(validation.messages())
    try {
      const historicItem = await HistoricItem.create(data)

      const returnItem = await HistoricItem.query()
        .with('historictype')
        .where({ id: historicItem.id })
        .fetch()

      return response.status(201).json(returnItem.toJSON()[0])
    } catch (e) {
      return response.badRequest(e.message)
    }
  }

  async update({ params, request, response }) {
    const { id } = params

    const data = request.only([
      'user_id',
      'title',
      'description',
      'historic_type_id',
      'start_at',
      'end_at',
    ])

    const rules = {
      id: 'required|integer',
      user_id: 'required|integer',
      title: 'required|string',
      description: 'required|string',
      historic_type_id: 'required|integer',
      start_at: 'string',
      end_at: 'string',
    }
    const validation = await validate({ id, ...data }, rules)
    if (validation.fails()) return response.unprocessableEntity(validation.messages())

    const historicItem = await HistoricItem.find(id)

    if (historicItem) {
      try {
        historicItem.merge(data)
        await historicItem.save()
      } catch (e) {
        return response.conflict(e.message)
      }
      return response.json(
        (
          await HistoricItem.query().with('historictype').where({ id: historicItem.id }).fetch()
        ).toJSON()[0]
      )
    }
    return response.badRequest()
  }

  async delete({ params, request, response }) {
    const rules = {
      id: 'required|integer',
    }

    const validation = await validate(params, rules)

    if (validation.fails()) return response.badRequest(validation.messages())

    const { id } = params

    const deleted = await HistoricItem.query().where({ id }).delete()

    if (deleted) {
      return response.noContent()
    }
    return response.notFound()
  }
}

module.exports = HistoricItemController
