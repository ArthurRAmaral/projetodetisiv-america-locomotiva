/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')
const Hash = use('Hash')

class UserSchema extends Schema {
  up() {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('avatar', 512)
      table.string('fullName')
      table.string('nickname')
      table.string('phone').notNullable().defaultTo('')
      table.string('rg', 20)
      table.string('cpf', 11)
      table.string('cep', 8)
      table.string('state')
      table.string('city')
      table.string('neighborhood')
      table.string('street')
      table.integer('buildingNumber').defaultTo(0)
      table.string('complement')
      table.decimal('weight')
      table.integer('height')
      table.datetime('dob')
      table.string('emergencyName')
      table.string('emergencyEmail')
      table.string('emergencyPhone')
      table.string('emergencyConsanguinity')
      table.string('healthInsurance')
      table.string('sex').notNullable().defaultTo('')
      table.boolean('active').notNullable().defaultTo(true)
      table.timestamps(/* useTimestamps: */ false, /* defaultToNow: */ true)

      // Create default admin user
      this.schedule(async (trx) => {
        await Database.table('users')
          .transacting(trx)
          .insert([
            {
              username: 'admin',
              email: 'admin@email.com',
              fullName: 'Administrador do Sistema',
              nickname: 'Administrador',
              password: await Hash.make('admin'),
              active: true,
            },
          ])
      })
    })
  }

  down() {
    this.drop('users')
  }
}

module.exports = UserSchema
