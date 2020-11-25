/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserTeamSchema extends Schema {
  up() {
    this.create('user_teams', (table) => {
      table.increments()
      table.integer('user_id').notNullable().unsigned().references('users.id').onDelete('cascade')
      table.integer('team_id').notNullable().unsigned().references('teams.id').onDelete('cascade')
      table.integer('group_id').notNullable().unsigned().references('groups.id').onDelete('cascade')
      table.timestamps(/* useTimestamps: */ false, /* defaultToNow: */ true)
    })
  }

  down() {
    this.drop('user_teams')
  }
}

module.exports = UserTeamSchema
