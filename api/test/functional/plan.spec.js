const { test, trait } = use('Test/Suite')('Plan')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const User = use('App/Models/User')
const Plan = use('App/Models/Plan')
const Factory = use('Factory')

test('listagem de planos de pagamento', async ({ assert, client }) => {
  const admin = await User.find(1)
  const plans = await Factory.model('App/Models/Plan').createMany(3)

  const response = await client.get('/api/v1/plan').loginVia(admin).end()
  response.assertStatus(200)

  assert.equal(plans.length, 3)
})

test('detalhes do plano de pagamento', async ({ assert, client }) => {
  const admin = await User.find(1)
  const plan = await Factory.model('App/Models/Plan').create()

  const response = await client.get(`/api/v1/plan/${plan.id}`).loginVia(admin).end()
  response.assertStatus(200)

  assert.deepInclude(response.body, plan.toJSON())
})

test('criação de plano de pagamento', async ({ assert, client }) => {
  const admin = await User.find(1)

  const data = {
    name: 'NEWNAME',
    monthlyPrice: 888,
  }

  const response = await client.post(`/api/v1/plan`).send(data).loginVia(admin).end()
  response.assertStatus(201)

  const { body } = response

  const plan = await Plan.find(body.id)
  const actual = plan.toJSON()

  assert.deepInclude(actual, data)
  assert.deepInclude(actual, body)
})

test('edição do plano de pagamento', async ({ assert, client }) => {
  const admin = await User.find(1)
  const plan = await Factory.model('App/Models/Plan').create({
    name: 'OLDNAME',
    monthlyPrice: 999,
  })

  const data = {
    name: 'NEWNAME',
    monthlyPrice: 888,
    active: 0,
  }

  const response = await client.put(`/api/v1/plan/${plan.id}`).send(data).loginVia(admin).end()
  response.assertStatus(200)

  await plan.reload()

  const actual = plan.toJSON()

  const expected = {
    name: 'NEWNAME',
    monthlyPrice: 888,
    active: 1,
  }

  assert.containsAllKeys(actual, expected)
  assert.deepInclude(actual, expected)
})

test('remoção de plano de pagamento', async ({ assert, client }) => {
  const admin = await User.find(1)
  const plan = await Factory.model('App/Models/Plan').create({
    active: true,
  })

  const response = await client.delete(`/api/v1/plan/${plan.id}`).loginVia(admin).end()
  response.assertStatus(200)

  await plan.reload()

  assert.isNotOk(plan.active)
})

test('restauração de plano de pagamento excluído', async ({ assert, client }) => {
  const admin = await User.find(1)
  const plan = await Factory.model('App/Models/Plan').create({
    active: false,
  })

  const response = await client.post(`/api/v1/plan/${plan.id}/restore`).loginVia(admin).end()
  response.assertStatus(200)

  await plan.reload()
  assert.isOk(plan.active)
})

test('vincular usuário a um plano de pagamento', async ({ assert, client }) => {
  const admin = await User.find(1)
  const plan = await Factory.model('App/Models/Plan').create()
  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .post(`/api/v1/plan/${plan.id}/subscribe/${user.id}`)
    .loginVia(admin)
    .end()

  response.assertStatus(200)
  await plan.load('users')
  await user.reload()

  const { users } = plan.toJSON()
  const [actual] = users
  const expected = user.toJSON()

  assert.deepInclude(actual, expected)
})
