/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {typeof AdonisType.Hash} */
const Hash = use('Hash')

class User extends Model {
  getWeight(weight) {
    return Number(weight) || null
  }

  static get hidden() {
    return ['password']
  }

  static get dates() {
    return super.dates.concat(['dob'])
  }

  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }

      if (userInstance.dirty.nickname !== undefined && !userInstance.dirty.nickname) {
        const { fullName } = userInstance
        const [firstName] = fullName.split(' ')
        userInstance.nickname = firstName
      }

      if (userInstance.dirty.username !== undefined && !userInstance.dirty.username) {
        userInstance.username = userInstance.email
      }
    })

    this.addHook('beforeCreate', async (userInstance) => {
      if (!userInstance.dirty.nickname) {
        const { fullName } = userInstance
        const [firstName] = fullName.split(' ')
        userInstance.nickname = firstName
      }

      if (!userInstance.dirty.username) {
        userInstance.username = userInstance.email
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {typeof AdonisType.Relationship.HasMany}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

  teams() {
    return this.belongsToMany('App/Models/Team').pivotModel('App/Models/UserTeam')
  }

  /**
   * Representa a função do usuário no sistema
   */
  group() {
    return this.belongsTo('App/Models/Group')
  }

  /**
   * Representa a função do usuário em cada time
   */
  roles() {
    return this.hasMany('App/Models/UserTeam')
  }

  logs() {
    return this.belongsToMany('App/Models/Log').withPivot(['justification', 'points', 'presence'])
  }

  /**
   * @method annotations
   *
   * @return {import('@adonisjs/lucid/src/Lucid/Relations/HasMany')}
   */
  annotations() {
    return this.hasMany('App/Models/Annotation')
  }

  plan() {
    return this.belongsTo('App/Models/Plan')
  }

  historic() {
    return this.hasMany('App/Models/HistoricItem')
  }

  condition() {
    return this.belongsTo('App/Models/Condition')
  }

  payments() {
    return this.hasMany('App/Models/Payment')
  }
}

module.exports = User
