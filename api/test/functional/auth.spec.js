const { test, trait } = use('Test/Suite')('Auth')

// Habilita o simulador de cliente HTTP
trait('Test/ApiClient')
// Trait utilizada para truncar o banco após cada teste
trait('DatabaseTransactions')

const Factory = use('Factory')

test('autenticação de usuário com JWT', async ({ assert, client }) => {
  // criando usuário com e-mail e senha
  await Factory.model('App/Models/User').create({
    email: 'user1@mail.com',
    password: 'passwd',
  })

  // tentando logar com as credenciais do usuário criado
  const response = await client
    .post('/api/v1/authenticate')
    .send({
      email: 'user1@mail.com',
      password: 'passwd',
    })
    .end()

  const { body } = response

  response.assertStatus(200)
  assert.exists(body.token)
})
