/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Plan extends Model {
  getMonthlyPrice(value) {
    return Number(value) || null
  }

  users() {
    return this.hasMany('App/Models/User')
  }

  payments() {
    return this.hasMany('App/Models/Payment')
  }
}

module.exports = Plan
