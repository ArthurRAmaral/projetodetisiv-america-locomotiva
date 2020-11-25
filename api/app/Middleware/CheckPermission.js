/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class CheckPermission {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Request} ctx.response
   * @param {Function} next
   */
  async handle({ /* request , */ response, auth }, next, props) {
    const permissionNeeded = props
    // const { Authorization } = request.headers()
    // const { user } = Authorization.data

    try {
      await auth.check()
    } catch (error) {
      return response.unauthorized()
    }

    // TODO Falta arquitetura
    switch (permissionNeeded) {
      case 'cadastrar usuarios':
        break
      case 'listar usuarios':
        break
      case 'detalhar usuarios':
        break
      case 'editar usuarios':
        break
      case 'excluir usuarios':
        break
      case 'cadastrar times':
        break
      case 'listar times':
        break
      case 'detalhar time':
        break
      case 'editar time':
        break
      case 'excluir time':
        break
      case 'gerenciar grupos de permissao':
        break
      default:
        break
    }

    return next()
  }
}

module.exports = CheckPermission
