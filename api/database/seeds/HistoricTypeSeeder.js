/*
|--------------------------------------------------------------------------
| HistoricTypeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const HistoricType = use('App/Models/HistoricType')

class HistoricTypeSeeder {
  async run() {
    const types = [
      {
        type: 'Desligamento',
        description: 'Desligamento ou pausa de um atleta.',
        color: '#303030',
      },
      {
        type: 'Lesão',
        description: 'Jogador machucado',
        color: '#F12121',
      },
      {
        type: 'Intercâmbio',
        description: 'Experiêcia em outro time',
        color: '#9C44F3',
      },
    ]
    await HistoricType.createMany(types)
  }
}

module.exports = HistoricTypeSeeder
