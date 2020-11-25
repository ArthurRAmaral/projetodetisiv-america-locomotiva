/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Token extends Model {
  static boot() {
    super.boot()
    this.addTrait('Token')
  }

  static get dates() {
    return super.dates.concat(['expires_at'])
  }
}

module.exports = Token
