/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Group extends Model {
  permissions() {
    return this.belongsToMany('App/Models/Permission')
  }
}

module.exports = Group
