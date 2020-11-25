/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PlanSchema extends Schema {
  up() {
    this.create('plans', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.decimal('monthlyPrice').notNullable()
      table.boolean('active').notNullable().defaultTo(true)
      table.timestamps()
    })

    this.alter('users', (table) => {
      table.integer('plan_id').unsigned().references('plans.id').onDelete('cascade')
    })
  }

  down() {
    this.alter('users', (table) => {
      table.dropColumn('plan_id')
    })

    this.drop('plans')
  }
}

module.exports = PlanSchema
