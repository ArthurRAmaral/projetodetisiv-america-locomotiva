/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterUserSchema extends Schema {
  up() {
    this.table('users', (table) => {
      table.string('avatarUrl')
    })

    // move avatar data to avatarUrl
    this.schedule(async (trx) => {
      await trx.raw('update users set "avatarUrl" = avatar, avatar = null')
    })
  }

  async down() {
    this.schedule(async (trx) => {
      await trx.raw('update users set avatar = "avatarUrl"')

      this.table('users', (table) => {
        table.dropColumn('avatarUrl')
      })
    })
  }
}

module.exports = AlterUserSchema
