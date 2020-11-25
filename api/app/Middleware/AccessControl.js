/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {typeof import('@adonisjs/lucid/src/Lucid/Model')} Model */

const { userHasPermission } = require('../../services/access-control')

class AccessControl {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ params, request, auth }, next, properties) {
    // console.log(properties)
    // await next()
    // return

    const [permission] = properties
    const [type] = (permission || '').split('/')
    const { team_id } = { ...params, ...request.all() }

    const user = await auth.getUser()

    await user.loadMany(['roles.permissions', 'group.permissions'])

    let hasPemission

    const loggedUser = user.toJSON()

    switch (type) {
      case 'team': {
        hasPemission = userHasPermission(loggedUser, permission, team_id)
        break
      }
      default: {
        hasPemission = userHasPermission(loggedUser, permission)
        break
      }
    }

    if (!hasPemission) {
      throw new Error(`User is not allowed to perform this action.`)
    }

    await next()
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async wsHandle(...args) {
    await this.handle(...args)
  }
}

module.exports = AccessControl
