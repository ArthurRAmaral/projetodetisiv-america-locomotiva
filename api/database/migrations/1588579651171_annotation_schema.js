/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AnnotationSchema extends Schema {
  up() {
    this.create('annotations', (
      /** @type {import('knex/types').TableBuilder | import('knex/types').AlterTableBuilder} */ table
    ) => {
      table.increments()

      table.string('annotation', 255)
      table.integer('user_id').unsigned().references('users.id').notNullable().onDelete('cascade')

      table.timestamps()
    })
  }

  down() {
    this.drop('annotations')
  }
}

module.exports = AnnotationSchema
