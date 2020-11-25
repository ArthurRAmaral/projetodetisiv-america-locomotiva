/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class HistoricType extends Model {
  historicItems() {
    return this.hasMany('App/Models/HistoricItem')
  }
}

module.exports = HistoricType
