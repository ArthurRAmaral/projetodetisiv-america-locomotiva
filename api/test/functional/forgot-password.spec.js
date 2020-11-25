const moment = require('moment')

const Suite = use('Test/Suite')('Forgot Password')

const { test, trait } = Suite

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

const Mail = use('Mail')
const Factory = use('Factory')
const Hash = use('Hash')

const Token = use('App/Models/Token')

test('envio de e-mail com link de recuperação', async ({ assert, client }) => {
  Mail.fake()

  const user = await Factory.model('App/Models/User').create()

  const response = await client.post(`/api/v1/forgot-password/request/${user.email}`).end()

  response.assertStatus(200)

  const recentEmail = Mail.pullRecent()
  assert.equal(recentEmail.message.to[0].address, user.email)

  Mail.restore()
})

test('alteração de senha com token de recuperação', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create()

  const token = await Token.createPasswordRecoveryToken(user.id)

  const payload = {
    token: token.token,
    password: 'NEWPASSWORD',
  }

  const response = await client.post('/api/v1/forgot-password/reset').send(payload).end()

  response.assertStatus(200)

  await user.reload()
  await token.reload()

  const matches = await Hash.verify(payload.password, user.password)

  assert.isTrue(Boolean(matches))
  assert.isTrue(Boolean(token.is_revoked))
})

test('rejeitar token de recuperação expirado', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    password: 'OLDPASSWORD',
  })

  // token expirado a 1h
  const token = await Token.createPasswordRecoveryToken(user.id)
  token.expires_at = moment().subtract(1, 'hour')
  await token.save()

  const payload = {
    token: token.token,
    password: 'NEWPASSWORD',
  }

  const response = await client.post('/api/v1/forgot-password/reset').send(payload).end()

  await user.reload()

  const matches = await Hash.verify(payload.password, user.password)

  response.assertStatus(400)
  assert.isFalse(matches)
})

test('rejeitar token de recuperação já utilizado', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    password: 'OLDPASSWORD',
  })

  // token já utililzado
  const token = await Token.createPasswordRecoveryToken(user.id)
  token.is_revoked = true
  await token.save()

  const payload = {
    token: token.token,
    password: 'NEWPASSWORD',
  }

  const response = await client.post('/api/v1/forgot-password/reset').send(payload).end()

  await user.reload()

  const matches = await Hash.verify(payload.password, user.password)

  response.assertStatus(400)
  assert.isFalse(matches)
})

test('verificar validade do token de recuperação senha', async ({ client }) => {
  const valid = await Token.createPasswordRecoveryToken(1)
  const revoked = await Token.createPasswordRecoveryToken(1)
  const expired = await Token.createPasswordRecoveryToken(1)

  revoked.is_revoked = true
  expired.expires_at = moment().subtract(1, 'hour')

  await revoked.save()
  await expired.save()

  const revokedResponse = await client.get(`/api/v1/forgot-password/verify/${revoked.token}`).end()
  const expiredResponse = await client.get(`/api/v1/forgot-password/verify/${expired.token}`).end()
  const validResponse = await client.get(`/api/v1/forgot-password/verify/${valid.token}`).end()

  revokedResponse.assertStatus(400)
  expiredResponse.assertStatus(400)
  validResponse.assertStatus(200)
})
