/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Helpers = use('Helpers')

// Protected routes
Route.group(() => {
  /*
   * Rotas historic itens
   */
  Route.get('/historicitems/peruser/:user_id', 'HistoricItemController.retrivePerUser')
  Route.get('/historicitems', 'HistoricItemController.retrivePerUser')
  // .middleware(["acecess:application/userhistoric/manage"]);
  Route.post('/historicitems', 'HistoricItemController.store')
  // .middleware(["acecess:application/userhistoric/manage"]);
  Route.put('/historicitems/:id', 'HistoricItemController.update')
  // .middleware(["acecess:application/userhistoric/manage"]);
  Route.delete('/historicitems/:id', 'HistoricItemController.delete')
  // .middleware(["acecess:application/userhistoric/manage"]);
  /** *********************** */

  /*
   * Rotas historic types
   */

  Route.get('/historictypes/all', 'HistoricTypeController.index')
  // .middleware(["acecess:application/historictypes/manage"]);
  Route.get('/historictypes/:id', 'HistoricTypeController.retrive')
  // .middleware(["acecess:application/historictypes/manage"]);
  Route.get('/historictypes/:id/users', 'HistoricTypeController.retriveUsers')
  // .middleware(["acecess:application/historictypes/manage"]);
  Route.post('/historictypes', 'HistoricTypeController.store')
  // .middleware(["acecess:application/historictypes/manage"]);
  Route.put('/historictypes/:id', 'HistoricTypeController.update')
  // .middleware(["acecess:application/historictypes/manage"]);
  Route.delete('/historictypes/:id', 'HistoricTypeController.delete')
  // .middleware(["acecess:application/historictypes/manage"]);
  /** *********************** */

  Route.get('/user/search', 'UserController.search').middleware(['access:application/users/manage'])

  Route.resource('/user', 'UserController')
    .apiOnly()
    .middleware(['access:application/users/manage'])

  Route.post('/user/restore/:id', 'UserController.restore').middleware([
    'access:application/users/manage',
  ])

  Route.post('/user/:id/annotation', 'UserController.storeAnnotation').middleware([
    'access:application/users/manage',
  ])

  Route.put(
    '/user/:user_id/annotation/:annotation_id',
    'UserController.updateAnnotation'
  ).middleware(['access:application/users/manage'])

  Route.delete(
    '/user/:user_id/annotation/:annotation_id',
    'UserController.destroyAnnotation'
  ).middleware(['access:application/users/manage'])

  Route.post('/user/:id/change-password', 'UserController.changePassword')

  Route.post('/user/self', 'UserController.updateSelf')

  Route.post('/user/self/avatar', 'UserController.uploadAvatar')

  Route.get('/users/roles', 'UserController.roles')

  Route.get('/users/ranges', 'UserController.ranges')

  Route.put('/team/restore/:id', 'TeamController.restore').middleware([
    'access:application/teams/manage',
  ])

  Route.get('/team/roles', 'TeamController.roles').middleware(['access:application/teams/manage'])

  Route.get('/team/members', 'TeamController.showTeamListWithMembers').middleware([
    'access:application/teams/manage',
  ])

  Route.post('/team/:team_id/image', 'TeamController.uploadImage').middleware([
    'access:application/teams/manage',
  ])

  Route.post('/team/:team_id/members', 'TeamController.addManyMembers').middleware([
    'access:application/teams/manage',
  ])

  Route.post('/team/:team_id/member/:user_id', 'TeamController.addMember').middleware([
    'access:application/teams/manage',
  ])

  Route.delete('/team/:team_id/member/:user_id', 'TeamController.deleteMember').middleware([
    'access:application/teams/manage',
  ])

  Route.resource('/team', 'TeamController')
    .apiOnly()
    .middleware(['access:application/teams/manage'])

  Route.post('/plan/:id/restore', 'PlanController.restore').middleware([
    'access:application/plans/manage',
  ])

  Route.post('/plan/:plan_id/subscribe/:user_id', 'PlanController.subscribe').middleware([
    'access:application/plans/manage',
  ])

  Route.resource('/plan', 'PlanController')
    .apiOnly()
    .middleware(['access:application/plans/manage'])

  Route.resource('/permission', 'PermissionController').apiOnly()
  Route.resource('/group', 'GroupController').apiOnly()

  Route.get('/event/event-types', 'LogController.allLogTypes')

  Route.put('/event/check-presence/:id', 'LogController.checkPresence')

  Route.put('/event/:log_id/user/:user_id', 'LogController.updateUserLog')

  Route.get('/event/user/:id', 'LogController.showUserLog')
  Route.get('/event/team/:id', 'LogController.showTeamLog')

  Route.resource('/event', 'LogController').apiOnly()

  Route.resource('/conditions', 'ConditionController').apiOnly()
  Route.post('/conditions/:condition_id/subscribe/:user_id', 'ConditionController.subscribe')

  Route.get('/birthday/', 'UserController.birthday')
  Route.get('/birthday/today', 'UserController.todayBirthday')

  Route.resource('/payments', 'PaymentController')
  Route.post('/payments/generate/:id', 'PaymentController.generate')
  Route.get('/payments/plan/:id', 'PaymentController.indexPlan')

  Route.get('/payments/dashboard/expectations', 'PaymentController.getExpectations')

  Route.get('/auth/refresh', 'AuthController.refresh')
})
  .prefix('api/v1')
  .middleware('auth')

Route.group(() => {
  Route.post('/authenticate', 'AuthController.authenticate')

  Route.post('/forgot-password/reset', 'ForgotPasswordController.reset')
  Route.post('/forgot-password/request/:email', 'ForgotPasswordController.request')
  Route.get('/forgot-password/verify/:token', 'ForgotPasswordController.verify')
}).prefix('api/v1')

Route.get('/image/:filename', 'HomeController.image')

Route.any('*', ({ response }) => response.download(Helpers.publicPath('index.html')))
