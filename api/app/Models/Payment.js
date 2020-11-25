'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Payment extends Model {
  static get table() {
    return 'payments'
  }

  user() {
    return this.belongsTo('App/Models/User')
  }

  plan() {
    return this.belongsTo('App/Models/Plan')
  }
}

module.exports = Payment
