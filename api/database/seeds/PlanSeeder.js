'use strict'

/*
|--------------------------------------------------------------------------
| PlanSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Plan = use('App/Models/Plan')

class PlanSeeder {
  async run() {
    await Plan.createMany([
      {
        name: 'Plano Padrão R$50',
        monthlyPrice: 50,
      },
      {
        name: 'Plano Padrão R$75',
        monthlyPrice: 75,
      },
      {
        name: 'Plano Padrão R$100',
        monthlyPrice: 100,
      },
    ])
  }
}

module.exports = PlanSeeder
