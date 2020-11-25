const Helpers = use('Helpers')

/**
 * GET image/:filename
 */
class HomeController {
  async image({ params, response }) {
    const { filename } = params
    const path = Helpers.resourcesPath(`assets/images/${filename}`)
    return response.download(path)
  }
}

module.exports = HomeController
