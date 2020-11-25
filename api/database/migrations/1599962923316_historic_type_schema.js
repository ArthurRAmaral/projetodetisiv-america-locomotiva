/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HistoricTypeSchema extends Schema {
  up() {
    this.create('historic_types', (table) => {
      table.increments()
      table.string('type').notNullable().unique()
      table.string('description').notNullable()
      table.string('color', 7).notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('historic_types')
  }
}

module.exports = HistoricTypeSchema
