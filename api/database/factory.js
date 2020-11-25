/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Hash = use('Hash')

Factory.blueprint('App/Models/User', async (faker, i, data) => {
  return {
    username: faker.username(),
    email: faker.email(),
    password: await Hash.make(faker.password()),
    avatarUrl: `https://i.pravatar.cc/285?u=${faker.email()}`,
    fullName: faker.name(),
    nickname: faker.first(),
    phone: faker.phone({ formatted: false, country: 'br' }),
    rg: faker.ssn({ dashes: false }),
    cpf: faker.cpf().replace(/\D/g, ''),
    cep: faker.zip().padEnd(8, '0'),
    state: faker.state(),
    city: faker.city(),
    neighborhood: faker.word(),
    street: faker.street(),
    buildingNumber: faker.natural({ max: 50000 }),
    complement: faker.string({
      length: 8,
      casing: 'upper',
      alpha: true,
      numeric: true,
    }),
    weight: faker.natural({ min: 0, max: 300 }),
    height: faker.natural({ max: 250 }),
    dob: faker.birthday(),
    emergencyName: faker.name(),
    emergencyEmail: faker.email(),
    emergencyPhone: faker.phone({ formatted: false }),
    emergencyConsanguinity: faker.word(),
    healthInsurance: faker.word(),
    sex: faker.pickone(['Feminino', 'Masculino']),
    active: 1,
    group_id: null,
    plan_id: 1,
    condition_id: 1,
    ...data,
  }
})

Factory.blueprint('App/Models/Token', async (faker, i, data) => {
  return {
    user_id: faker.natural({ max: 100 }),
    type: 'jwt_refresh_token',
    token: faker.guid(),
    is_revoked: 0,
    ...data,
  }
})

Factory.blueprint('App/Models/Permission', async (faker, i, data) => {
  return {
    name: faker.string({ length: 10 }),
    title: faker.string({ length: 20 }),
    description: faker.string({ length: 50 }),
    ...data,
  }
})

Factory.blueprint('App/Models/Group', async (faker, i, data) => {
  return {
    name: faker.string({ length: 10 }),
    title: faker.string({ length: 20 }),
    type: 'application',
    default: 0,
    description: faker.string({ length: 50 }),
    ...data,
  }
})

Factory.blueprint('App/Models/Team', async (faker, i, data) => {
  return {
    name: faker.string({ length: 10 }).replace('%', ''),
    description: faker.string({ length: 50 }),
    imageUrl: faker.avatar(),
    active: 1,
    ...data,
  }
})

Factory.blueprint('App/Models/Log', async (faker, i, data) => {
  return {
    name: faker.string({ length: 15 }),
    start_date: faker.date({ string: true }),
    end_date: faker.date({ string: true }),
    comments: faker.string({ length: 40 }),
    active: 1,
    ...data,
  }
})

Factory.blueprint('App/Models/LogType', async (faker, i, data) => {
  return {
    name: faker.string({ length: 10 }),
    description: faker.string({ length: 30 }),
    points: faker.integer({ min: 1, max: 5 }),
    ...data,
  }
})

Factory.blueprint('App/Models/Annotation', async (faker, i, data) => {
  return {
    annotation: faker.string({ length: 50 }),
    ...data,
  }
})

Factory.blueprint('App/Models/Plan', async (faker, i, data) => {
  return {
    name: faker.string({ length: 30 }),
    monthlyPrice: faker.floating({ min: 0, fixed: 2 }),
    active: 1,
    ...data,
  }
})
