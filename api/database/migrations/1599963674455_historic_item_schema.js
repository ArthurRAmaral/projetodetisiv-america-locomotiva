/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HistoricItemSchema extends Schema {
  up() {
    this.create('historic_items', (table) => {
      table.increments()
      table.integer('user_id').notNullable().unsigned().references('users.id').onDelete('cascade')
      table.string('title')
      table.string('description')
      table
        .integer('historic_type_id')
        .notNullable()
        .unsigned()
        .references('historic_types.id')
        .onDelete('cascade')
      table.dateTime('start_at')
      table.dateTime('end_at')
      table.timestamps()
    })
  }

  down() {
    this.drop('historic_items')
  }
}

module.exports = HistoricItemSchema
