/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LogSchema extends Schema {
  up() {
    this.create('logs', (
      /** @type {import('knex/types').TableBuilder | import('knex/types').AlterTableBuilder} */ table
    ) => {
      table.increments()

      table.string('name')
      table.dateTime('start_date')
      table.dateTime('end_date')
      table.string('comments', 255)
      table.boolean('active').defaultTo(true)
      table.integer('log_type_id').unsigned().references('log_types.id').notNullable()

      table.timestamps()
    })
  }

  down() {
    this.drop('logs')
  }
}

module.exports = LogSchema
