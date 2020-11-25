/*
|--------------------------------------------------------------------------
| LogTypeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class LogTypeSeeder {
  async run() {
    await Factory.model('App/Models/LogType').create({ name: 'Partida' })
    await Factory.model('App/Models/LogType').create({ name: 'Aula' })
  }
}

module.exports = LogTypeSeeder
