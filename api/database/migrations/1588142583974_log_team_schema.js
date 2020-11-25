/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LogTeamSchema extends Schema {
  up() {
    this.create('log_team', (
      /** @type {import('knex/types').TableBuilder | import('knex/types').AlterTableBuilder} */ table
    ) => {
      table.increments()

      table.integer('team_id').unsigned().references('teams.id')
      table.integer('log_id').unsigned().references('logs.id').onDelete('cascade')

      table.timestamps()
    })
  }

  down() {
    this.drop('log_team')
  }
}

module.exports = LogTeamSchema
