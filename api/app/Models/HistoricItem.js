/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class HistoricItem extends Model {
  user() {
    return this.belongsTo('App/Models/User')
  }

  historictype() {
    return this.belongsTo('App/Models/HistoricType')
  }
}

module.exports = HistoricItem
