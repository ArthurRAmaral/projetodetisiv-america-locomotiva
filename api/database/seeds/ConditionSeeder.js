/*
|--------------------------------------------------------------------------
| ConditionSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Condition = use('App/Models/Condition')

class ConditionSeeder {
  async run() {
    await Condition.createMany([
      {
        name: 'Normalizado',
        color: '#3DB22D',
      },
      {
        name: 'Lesionado',
        color: '#CF1616',
      },
      {
        name: 'Desvinculado',
        color: '#000000',
      },
    ])
  }
}

module.exports = ConditionSeeder
