/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterTeamSchema extends Schema {
  up() {
    this.table('teams', (table) => {
      table.string('imageUrl')
    })

    // move image data to imageUrl
    this.schedule(async (trx) => {
      await trx.raw('update teams set "imageUrl" = image, image = null')
    })
  }

  down() {
    this.schedule(async (trx) => {
      await trx.raw('update teams set image = "imageUrl"')

      this.table('teams', (table) => {
        table.dropColumn('imageUrl')
      })
    })
  }
}

module.exports = AlterTeamSchema
