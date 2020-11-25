// const { test, trait } = use('Test/Suite')('Event')
// const chai = require('chai')
// chai.use(require('chai-subset'))

// trait('Test/ApiClient')
// trait('DatabaseTransactions')
// trait('Auth/Client')

// const { expect } = chai

// /** @type {import('@adonisjs/lucid/src/Factory')} */
// const Factory = use('Factory')

// const Log = use('App/Models/Log')

// test('listagem de eventos', async ({ assert, client }) => {
//   const login = await Factory.model('App/Models/User').create()

//   await Factory.model('App/Models/Log').createMany(3)

//   const response = await client.get('api/v1/event').loginVia(login).end()
//   const { body } = response

//   response.assertStatus(200)
//   assert.isAtLeast(body.length, 3)
// })

// test('cadastro de evento', async ({ client }) => {
//   const login = await Factory.model('App/Models/User').create()

//   const team = await Factory.model('App/Models/Team').create()
//   const logType = await Factory.model('App/Models/LogType').create()
//   const user = await Factory.model('App/Models/User').create()
//   const log = await Factory.model('App/Models/Log').make()

//   const response = await client
//     .post('api/v1/event')
//     .send({
//       logType: logType.id,
//       teams: [team.id],
//       users: [user.id],
//       ...log.toJSON(),
//     })
//     .loginVia(login)
//     .end()

//   const logDB = await Log.query()
//     .with('users')
//     .with('teams')
//     .with('logType')
//     .where('comments', log.comments)
//     .where('active', true)
//     .firstOrFail()

//   response.assertStatus(201)
//   expect(logDB.toJSON()).to.containSubset({
//     teams: [team.toJSON()],
//     logType: logType.toJSON(),
//     users: [user.toJSON()],
//     ...log.toJSON(),
//   })
// })

// test('detalhar evento', async ({ client }) => {
//   const login = await Factory.model('App/Models/User').create()

//   const logType = await Factory.model('App/Models/LogType').create()
//   const team = await Factory.model('App/Models/Team').create()
//   const user = await Factory.model('App/Models/User').create()

//   const log = await Factory.model('App/Models/Log').create()

//   await log.logType().associate(logType)
//   await log.teams().attach([team.id])
//   await log.users().attach([user.id], (pivot) => {
//     // eslint-disable-next-line no-param-reassign
//     pivot.justification = 'vazio'
//     // eslint-disable-next-line no-param-reassign
//     pivot.points = '1'
//     // eslint-disable-next-line no-param-reassign
//     pivot.presence = true
//   })

//   const response = await client.get(`api/v1/event/${log.id}`).loginVia(login).end()
//   const { body } = response

//   response.assertStatus(200)
//   expect(body).to.containSubset({
//     ...log.toJSON(),
//     start_date: new Date(log.start_date).toISOString(),
//     end_date: new Date(log.end_date).toISOString(),
//     teams: [team.toJSON()],
//     logType: logType.toJSON(),
//     users: [
//       {
//         ...user.toJSON(),
//         pivot: { justification: 'vazio', points: 1, presence: true },
//       },
//     ],
//   })
// })

// test('editar evento', async ({ client }) => {
//   const login = await Factory.model('App/Models/User').create()

//   const team = await Factory.model('App/Models/Team').create()
//   const logType = await Factory.model('App/Models/LogType').create()
//   const user = await Factory.model('App/Models/User').create()

//   const log = await Factory.model('App/Models/Log').create()

//   await log.logType().associate(logType)
//   await log.teams().attach([team.id])
//   await log.users().attach([user.id])

//   const newData = {
//     start_date: new Date(),
//     end_date: new Date(),
//     comments: 'novo',
//     teams: [team.id],
//     logType: logType.id,
//     users: [user.id],
//   }

//   const response = await client.put(`api/v1/event/${log.id}`).send(newData).loginVia(login).end()

//   const logDB = await Log.query()
//     .with('users')
//     .with('teams')
//     .with('logType')
//     .where('id', log.id)
//     .where('active', true)
//     .firstOrFail()

//   response.assertStatus(204)
//   expect(logDB.toJSON()).to.containSubset({
//     ...newData,
//     teams: [team.toJSON()],
//     logType: logType.toJSON(),
//     users: [user.toJSON()],
//   })
// })

// test('desativar evento', async ({ assert, client }) => {
//   const login = await Factory.model('App/Models/User').create()

//   const log = await Factory.model('App/Models/Log').create()

//   const response = await client.delete(`api/v1/event/${log.id}`).loginVia(login).end()

//   await log.reload()

//   response.assertStatus(204)
//   assert.equal(false, log.active)
// })

// test('detalhar presença do usuario no evento', async ({ client }) => {
//   const login = await Factory.model('App/Models/User').create()

//   const logType = await Factory.model('App/Models/LogType').create()
//   const team = await Factory.model('App/Models/Team').create()
//   const user = await Factory.model('App/Models/User').create()

//   const log = await Factory.model('App/Models/Log').create()

//   await log.logType().associate(logType)
//   await log.teams().attach([team.id])
//   await log.users().attach([user.id], (pivot) => {
//     // eslint-disable-next-line no-param-reassign
//     pivot.justification = 'vazio'
//     // eslint-disable-next-line no-param-reassign
//     pivot.points = 1
//     // eslint-disable-next-line no-param-reassign
//     pivot.presence = true
//   })

//   const response = await client.get(`api/v1/event/${log.id}/user/${user.id}`).loginVia(login).end()
//   const { body } = response

//   response.assertStatus(200)
//   expect(body).to.containSubset({
//     ...user.toJSON(),
//     logs: [
//       {
//         ...log.toJSON(),
//         start_date: log.start_date.toISOString(),
//         end_date: log.end_date.toISOString(),
//         pivot: {
//           justification: 'vazio',
//           points: 1,
//           presence: true,
//         },
//         teams: [team.toJSON()],
//         logType: logType.toJSON(),
//       },
//     ],
//   })
// })

// test('editar presença do usuario no evento', async ({ assert, client }) => {
//   const login = await Factory.model('App/Models/User').create()

//   const logType = await Factory.model('App/Models/LogType').create()
//   const team = await Factory.model('App/Models/Team').create()
//   const user = await Factory.model('App/Models/User').create()

//   const log = await Factory.model('App/Models/Log').create()

//   await log.logType().associate(logType)
//   await log.teams().attach([team.id])
//   await log.users().attach([user.id], (pivot) => {
//     // eslint-disable-next-line no-param-reassign
//     pivot.justification = 'vazio'
//     // eslint-disable-next-line no-param-reassign
//     pivot.points = 1
//     // eslint-disable-next-line no-param-reassign
//     pivot.presence = true
//   })

//   const newData = { justification: 'novo', points: 2, presence: false }

//   const response = await client
//     .put(`api/v1/event/${log.id}/user/${user.id}`)
//     .send(newData)
//     .loginVia(login)
//     .end()

//   const body = await Log.query()
//     .with('users', (builder) => {
//       builder.where('user_id', user.id)
//     })
//     .where('id', log.id)
//     .where('active', true)
//     .first()

//   response.assertStatus(204)

//   assert.containSubset(body.toJSON(), {
//     ...log.toJSON(),
//     users: [
//       {
//         ...user.toJSON(),
//         pivot: newData,
//       },
//     ],
//   })

//   // expect(body.toJSON()).to.containSubset({
//   //   ...log.toJSON(),
//   //   users: [
//   //     {
//   //       ...user.toJSON(),
//   //       pivot: newData,
//   //     },
//   //   ],
//   // })
// })

// test('remover usuario do evento', async ({ assert, client }) => {
//   const login = await Factory.model('App/Models/User').create()

//   const logType = await Factory.model('App/Models/LogType').create()
//   const team = await Factory.model('App/Models/Team').create()
//   const user = await Factory.model('App/Models/User').create()

//   const log = await Factory.model('App/Models/Log').create()

//   await log.logType().associate(logType)
//   await log.teams().attach([team.id])
//   await log.users().attach([user.id], (pivot) => {
//     // eslint-disable-next-line no-param-reassign
//     pivot.justification = 'vazio'
//     // eslint-disable-next-line no-param-reassign
//     pivot.points = 1
//     // eslint-disable-next-line no-param-reassign
//     pivot.presence = true
//   })

//   const response = await client
//     .delete(`api/v1/event/${log.id}/user/${user.id}`)
//     .loginVia(login)
//     .end()

//   const body = await Log.query()
//     .with('users', (builder) => {
//       builder.where('user_id', user.id)
//     })
//     .where('id', log.id)
//     .where('active', true)
//     .first()

//   response.assertStatus(204)
//   assert.equal(body.toJSON().users.length, 0)
// })
