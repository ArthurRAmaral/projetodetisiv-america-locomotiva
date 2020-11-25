/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserTeam extends Model {
  static get table() {
    return 'user_teams'
  }

  user() {
    return this.belongsTo('App/Models/User')
  }

  team() {
    return this.belongsTo('App/Models/Team')
  }

  role() {
    return this.belongsTo('App/Models/Group')
  }

  permissions() {
    return this.manyThrough('App/Models/Group', 'permissions', 'group_id', 'id')
  }
}

module.exports = UserTeam
