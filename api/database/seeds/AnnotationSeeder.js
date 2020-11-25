/*
|--------------------------------------------------------------------------
| AnnotationSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')

class AnnotationSeeder {
  async run() {
    const annotation = await Factory.model('App/Models/Annotation').make({
      annotation: 'Esse usuário tem total acesso ao sistema',
    })
    const admin = await User.find(1)
    await admin.annotations().save(annotation)
  }
}

module.exports = AnnotationSeeder
