/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LogUserSchema extends Schema {
  up() {
    this.create('log_user', (
      /** @type {import('knex/types').TableBuilder | import('knex/types').AlterTableBuilder} */ table
    ) => {
      table.increments()

      table.string('justification', 255)
      table.integer('points')
      table.boolean('presence').defaultTo(false)
      table.integer('user_id').unsigned().references('users.id').notNullable()
      table.integer('log_id').unsigned().references('logs.id').notNullable().onDelete('cascade')

      table.timestamps()
    })
  }

  down() {
    this.drop('log_user')
  }
}

module.exports = LogUserSchema
