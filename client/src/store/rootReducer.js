import { combineReducers } from 'redux'
import auth from './ducks/auth'
import layout from './ducks/layout'
import navigation from './ducks/navigation'
import userList from './ducks/userList'
import user from './ducks/user'
import groups from './ducks/groups'
import teamList from './ducks/teamList'
import team from './ducks/team'
import teamRoles from './ducks/teamRoles'
import planList from './ducks/planList'
import plan from './ducks/plan'
import logTypes from './ducks/logTypes'
import event from './ducks/event'
import eventsList from './ducks/eventsList'
import historicTypes from './ducks/historicTypes'
import historicItems from './ducks/historicItem'
import historicTypeUsers from './ducks/historicTypeUsers'
import conditionList from './ducks/conditionList'
import birthdayUsers from './ducks/birthdayUsers'
import payments from './ducks/payments'
import userRoles from './ducks/userRoles'
import dashboardData from './ducks/dashboardData'



import userAgeRange from './ducks/userAgeRange'


const rootReducer = combineReducers({
  auth,
  layout,
  navigation,
  userList,
  user,
  groups,
  teamList,
  teamRoles,
  team,
  planList,
  plan,
  logTypes,
  event,
  eventsList,
  historicTypes,
  historicItems,
  historicTypeUsers,
  conditionList,
  birthdayUsers,
  payments,
  userRoles,
  userAgeRange,
  dashboardData
})

export default rootReducer
