/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class GroupSchema extends Schema {
  up() {
    this.create('groups', (table) => {
      table.increments()
      table.string('name', 80)
      table.string('title', 80)
      table.string('description', 255)
      table.string('type', 80)
      table.timestamps(/* useTimestamps: */ false, /* defaultToNow: */ true)
    })

    this.table('users', (table) => {
      table.integer('group_id').unsigned().references('groups.id')
    })

    this.schedule(async (trx) => {
      // create admin group
      await Database.table('groups')
        .transacting(trx)
        .insert([
          {
            name: 'admin',
            type: 'application',
            title: 'Administrador',
            description: 'Tem acesso a todas as funções do sistema.',
          },
        ])

      // set admin group to admin user
      await Database.table('users').transacting(trx).where('id', 1).update('group_id', 1)
    })
  }

  down() {
    this.drop('groups')
  }
}

module.exports = GroupSchema
