/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TeamSchema extends Schema {
  up() {
    this.create('teams', (table) => {
      table.increments()
      table.string('name', 80)
      table.string('image')
      table.string('description', 255)
      table.boolean('active').notNullable().defaultTo(true)
      table.timestamps(/* useTimestamps: */ false, /* defaultToNow: */ true)
    })
  }

  down() {
    this.drop('teams')
  }
}

module.exports = TeamSchema
