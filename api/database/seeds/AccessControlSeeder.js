/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Group = use('App/Model/Group')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Permission = use('App/Model/Permission')

const permissions = require('../../app/AccessControl/permissions')

const groups = [
  {
    name: 'manager',
    title: 'Gerentes',
    type: 'application',
    description: 'Tem a ferramentas gerenciais.',
  },
  {
    name: 'user',
    title: 'Usuário',
    type: 'application',
    description: 'Tem acesso a funções básicas.',
  },
  {
    name: 'coach',
    title: 'Treinador',
    type: 'team',
    description: 'Treina e gerencia as atividades do time',
  },
  {
    name: 'player',
    title: 'Jogador',
    type: 'team',
    description: 'Participa dos jogos e treinos',
  },
  {
    name: 'assistant',
    title: 'Auxiliar',
    type: 'team',
    description: 'Auxilia nas tarefas do time',
  },
]

class AccessControlSeeder {
  async run() {
    await Group.createMany(groups)
    await Permission.createMany(permissions)
  }
}

module.exports = AccessControlSeeder
