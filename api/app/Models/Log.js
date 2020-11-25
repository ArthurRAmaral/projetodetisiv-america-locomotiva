const moment = require('moment')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Log extends Model {
  getStartDate(startDate) {
    return moment(startDate).locale('pt-br')
  }

  getEndDate(endDate) {
    return moment(endDate).locale('pt-br')
  }

  /**
   * @method users
   *
   * @return {import('@adonisjs/lucid/src/Lucid/Relations/BelongsToMany')}
   */
  users() {
    return this.belongsToMany('App/Models/User').withPivot(['justification', 'points', 'presence'])
  }

  /**
   * @method teams
   *
   * @return {import('@adonisjs/lucid/src/Lucid/Relations/BelongsToMany')}
   */
  teams() {
    return this.belongsToMany('App/Models/Team')
  }

  /**
   * @method logType
   *
   * @return {import('@adonisjs/lucid/src/Lucid/Relations/BelongsTo')}
   */
  logType() {
    return this.belongsTo('App/Models/LogType')
  }
}

module.exports = Log
