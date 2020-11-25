/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Condition extends Model {
  users() {
    return this.hasMany('App/Models/User')
  }
}

module.exports = Condition
