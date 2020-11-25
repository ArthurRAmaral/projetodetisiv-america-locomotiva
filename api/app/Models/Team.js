/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Team extends Model {
  members() {
    return this.hasMany('App/Models/UserTeam')
  }

  users() {
    return this.belongsToMany('App/Models/User').pivotModel('App/Models/UserTeam')
  }

  logs() {
    return this.belongsToMany('App/Models/Log')
  }
}

module.exports = Team
