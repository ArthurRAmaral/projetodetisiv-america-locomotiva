const { test, trait } = use('Test/Suite')('Team')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const chai = require('chai')
const chaiSubset = require('chai-subset')

chai.use(chaiSubset)
// const { expect } = chai

const Database = use('Database')
const UserTeam = use('App/Models/UserTeam')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

/** @type {typeof import('../../app/Models/Team')} */
const Team = use('App/Models/Team')

/** @type {typeof import('../../app/Models/User')} */
const User = use('App/Models/User')

test('cadastro de times', async ({ assert, client }) => {
  const login = await User.find(1)

  const data = await Factory.model('App/Models/Team').make()

  const response = await client
    .post('api/v1/team')
    .send({
      name: data.name,
      description: data.description,
    })
    .loginVia(login)
    .end()

  const team = await Database.from('teams').where({
    name: data.name,
    description: data.description,
  })

  response.assertStatus(201)
  assert.exists(team)
})

test('detalhe do time', async ({ client }) => {
  const login = await User.find(1)

  const user = await Factory.model('App/Models/User').create(1)
  const team = await Factory.model('App/Models/Team').create(1)
  // const group = await Factory.model('App/Models/Group').create(1)
  const logType = await Factory.model('App/Models/LogType').create(1)
  const log = await Factory.model('App/Models/Log').make(1)

  // const userRole = await UserTeam.create({
  //   team_id: team.id,
  //   user_id: user.id,
  //   group_id: group.id,
  // })

  await log.logType().associate(logType)
  await log.teams().attach([team.id])
  await log.users().attach([user.id], (pivot) => {
    // eslint-disable-next-line no-param-reassign
    pivot.justification = 'vazio'
    // eslint-disable-next-line no-param-reassign
    pivot.points = '1'
    // eslint-disable-next-line no-param-reassign
    pivot.presence = true
  })

  const response = await client.get(`api/v1/team/${team.id}`).loginVia(login).end()

  // const expected = {
  //   ...team.toJSON(),
  //   members: [
  //     {
  //       ...userRole.toJSON(),
  //       role: group.toJSON(),
  //       user: user.toJSON(),
  //     },
  //   ],
  //   logs: [
  //     {
  //       ...log.toJSON(),
  //       start_date: log.start_date,
  //       end_date: log.end_date,
  //       users: [
  //         {
  //           ...user.toJSON(),
  //           pivot: {
  //             justification: 'vazio',
  //             points: 1,
  //             presence: true,
  //           },
  //         },
  //       ],
  //       logType: logType.toJSON(),
  //     },
  //   ],
  // }

  response.assertStatus(200)
  // expect(response.body).to.containSubset(expected)
})

test('listagem de times', async ({ assert, client }) => {
  const login = await User.find(1)

  await Factory.model('App/Models/Team').createMany(5)

  const response = await client.get('api/v1/team/').loginVia(login).end()

  const { body } = response
  const [team] = body

  response.assertStatus(200)
  assert.equal(5, body.length)
  assert.exists(team.members)
})

test('edicao de times', async ({ assert, client }) => {
  const login = await User.find(1)

  const team = await Factory.model('App/Models/Team').create()
  const newData = {
    name: 'novo nome',
    description: 'nova descricao',
  }

  const response = await client.put(`/api/v1/team/${team.id}`).send(newData).loginVia(login).end()

  await team.reload()

  response.assertStatus(200)
  assert.deepInclude(team.toJSON(), newData)
})

test('desativacao de times', async ({ assert, client }) => {
  const login = await User.find(1)

  const team = await Factory.model('App/Models/Team').create()

  const response = await client.delete(`/api/v1/team/${team.id}`).loginVia(login).end()

  const teamVerify = await Team.find(team.id)

  response.assertStatus(200)
  assert.equal(teamVerify.active, false)
})

test('associacao usuario a um time', async ({ assert, client }) => {
  const login = await User.find(1)

  const team = await Factory.model('App/Models/Team').create()
  const user = await Factory.model('App/Models/User').create()
  const group = await Factory.model('App/Models/Group').create()

  const response = await client
    .post(`/api/v1/team/${team.id}/member/${user.id}`)
    .send({ group_id: group.id })
    .loginVia(login)
    .end()

  // atualizando para pegar o usuário adicionado
  await team.loadMany({
    members: (builder) => {
      builder.with('user')
      builder.with('role')
    },
  })

  const { members } = team.toJSON()
  const [member] = members

  response.assertStatus(200)
  assert.deepInclude(member.user, user.toJSON())
  assert.deepInclude(member.role, group.toJSON())
})

test('remover usuario de um time', async ({ assert, client }) => {
  const login = await User.find(1)

  const team = await Factory.model('App/Models/Team').create()
  const user = await Factory.model('App/Models/User').create()
  const group = await Factory.model('App/Models/Group').create()

  await UserTeam.create({
    user_id: user.id,
    team_id: team.id,
    group_id: group.id,
  })

  const response = await client
    .delete(`/api/v1/team/${team.id}/member/${user.id}`)
    .loginVia(login)
    .end()

  await team.load('members')

  const actual = team.toJSON()

  response.assertStatus(204)
  assert.equal(actual.members.length, 0)
})
