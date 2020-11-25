const { test, trait } = use('Test/Suite')('Permission')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const Factory = use('Factory')

test('Listar permissoes', async ({ assert, client }) => {
  const login = await Factory.model('App/Models/User').create()

  await Factory.model('App/Models/Permission').createMany(3)

  const response = await client.get('api/v1/permission').loginVia(login).end()

  const { body } = response

  response.assertStatus(200)
  assert.isAtLeast(body.length, 3)
})
