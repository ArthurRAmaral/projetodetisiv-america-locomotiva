'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PaymentSchema extends Schema {
  up() {
    this.create('payments', (table) => {
      table.increments()
      table.integer('user_id').notNullable().unsigned().references('users.id').onDelete('cascade')
      table.integer('plan_id').notNullable().unsigned().references('plans.id').onDelete('cascade')
      table.decimal('value').notNullable()
      table.boolean('paid').notNullable().defaultTo(false)
      table.datetime('payment_date')
      table.datetime('due_date')
      table.timestamps()
    })
  }

  down() {
    this.drop('payments')
  }
}

module.exports = PaymentSchema
