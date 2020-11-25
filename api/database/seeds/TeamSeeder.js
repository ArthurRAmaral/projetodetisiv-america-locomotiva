/*
|--------------------------------------------------------------------------
| TeamSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Team = use('App/Models/Team')
const Env = use('Env')

class TeamSeeder {
  async run() {
    const imageUrl = `${Env.get('APP_URL')}/image/no-image.png`

    await Team.createMany([
      {
        name: 'Elite',
        description:
          'A Categoria Elite é a principal do América Locomotiva. Nela estão os atletas mais maduros, com maior expertise no esporte.',
        imageUrl,
      },
      {
        name: 'Formação',
        description:
          'A categoria de formação (também conhecida como AML2) foi criada em 2017. Atualmente disputa a Copa Ouro.',
        imageUrl,
      },
      {
        name: 'Junior',
        description:
          'Com o objetivo de formar atletas para atender as necessidades do time principal, o Júnior revelou diversos titulares do elenco atual, com destaque para os WRs Marcelo Mattos (Pokémon) e Arthur D’Angelo, do QB Gustavo Peixoto e o LB Matheus ‘Sereião’.',
        imageUrl,
      },
      {
        name: 'Flag Feminino',
        description:
          'Para saciar o crescimento do interesse feminino pelo esporte, foi criado, em janeiro de 2018, a categoria do Flag Feminino. Possui 33 mulheres dedicadas à fazer o esporte crescer.',
        imageUrl,
      },
      {
        name: 'Cheerleading',
        description:
          'A equipe de Cheerleading do América locomotiva foi fundada em 2016. Sua estreia foi no Estádio Independência, na abertura do Campeonato Mineiro de 2016, e desde então a equipe acompanha o Locomotiva e também participa de campeonatos regionais.',
        imageUrl,
      },
    ])
  }
}

module.exports = TeamSeeder
