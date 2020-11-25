/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ConditionSchema extends Schema {
  up() {
    this.create('conditions', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('color').notNullable()
      table.timestamps()
    })

    this.alter('users', (table) => {
      table.integer('condition_id').unsigned().references('conditions.id')
    })
  }

  down() {
    this.alter('users', (table) => {
      table.dropColumn('condition_id')
    })

    this.drop('conditions')
  }
}

module.exports = ConditionSchema
