/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Permission extends Model {
  groups() {
    return this.belongsToMany('App/Models/Group')
  }
}

module.exports = Permission
