/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('moment')

class Annotation extends Model {
  // eslint-disable-next-line camelcase
  getCreatedAt(date) {
    return moment(date).locale('pt-br').format('L')
  }

  // eslint-disable-next-line camelcase
  getUpdatedAt(date) {
    return moment(date).locale('pt-br').format('L')
  }

  /**
   * @method user
   *
   * @return {import('@adonisjs/lucid/src/Lucid/Relations/BelongsTo')}
   */
  user() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Annotation
