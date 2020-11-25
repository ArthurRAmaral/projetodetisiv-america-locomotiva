const { test, trait } = use('Test/Suite')('Group')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const Factory = use('Factory')
const Database = use('Database')

/** @type {typeof import('../../app/Models/Group')} */
const Group = use('App/Models/Group')

/** @type {typeof import('../../app/Models/Permission')} */
// const Permission = use('App/Models/Permission')

test('criar novo grupo de permissoes', async ({ assert, client }) => {
  const login = await Factory.model('App/Models/User').create()
  const g = await Factory.model('App/Models/Group').make()

  const data = {
    name: g.name,
    description: g.description,
    permission_id: [1, 2, 3],
  }

  const response = await client.post('api/v1/group').send(data).loginVia(login).end()

  const group = await Database.from('groups').where({
    name: data.name,
    description: data.description,
  })

  response.assertStatus(201)
  assert.exists(group)
})

test('detalhes do grupo de permissoes', async ({ client }) => {
  const login = await Factory.model('App/Models/User').create()

  const p0 = await Factory.model('App/Models/Permission').create()
  const p1 = await Factory.model('App/Models/Permission').create()
  const p2 = await Factory.model('App/Models/Permission').create()

  const group = await Factory.model('App/Models/Group').create()

  await group.permissions().attach([p0.id, p1.id, p2.id])
  await group.load('permissions')

  const response = await client.get(`api/v1/group/${group.id}`).loginVia(login).end()

  response.assertStatus(200)
  response.assertJSON(group.toJSON())
})

test('lista grupos de permissoes', async ({ assert, client }) => {
  const login = await Factory.model('App/Models/User').create()

  await Factory.model('App/Models/Group').createMany(3)

  const response = await client.get(`api/v1/group`).loginVia(login).end()
  const { body } = response

  response.assertStatus(200)
  assert.isAtLeast(body.length, 3)
})

test('edição de grupo de permissoes', async ({ client }) => {
  const login = await Factory.model('App/Models/User').create()

  const group = await Factory.model('App/Models/Group').create()

  const { id } = group
  const groupEdited = {
    name: 'novo nome',
    description: 'nova descricao',
  }

  const response = await client.put(`api/v1/group/${id}`).send(groupEdited).loginVia(login).end()

  await group.reload()

  response.assertStatus(200)
  // assert.containsAllDeepKeys(group, groupEdited)
})

test('exclusão de grupo de permissoes', async ({ assert, client }) => {
  const login = await Factory.model('App/Models/User').create()

  const group = await Factory.model('App/Models/Group').create()
  const response = await client.delete(`api/v1/group/${group.id}`).loginVia(login).end()

  const groupVerify = await Group.find(group.id)

  response.assertStatus(200)
  assert.notExists(groupVerify)
})
