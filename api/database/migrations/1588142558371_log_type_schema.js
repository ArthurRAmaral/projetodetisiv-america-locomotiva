/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LogTypeSchema extends Schema {
  up() {
    this.create('log_types', (
      /** @type {import('knex/types').TableBuilder | import('knex/types').AlterTableBuilder} */ table
    ) => {
      table.increments()

      table.string('name', 80).unique()
      table.string('description', 255)
      table.integer('points')

      table.timestamps()
    })
  }

  down() {
    this.drop('log_types')
  }
}

module.exports = LogTypeSchema
