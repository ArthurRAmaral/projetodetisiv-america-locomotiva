import api from '../../services/api'

const TEAM_ROLES_FETCHED = 'app/teamRoles/TEAM_ROLES_FETCHED'

export default function reducer(state = [], action) {
  switch (action.type) {
    case TEAM_ROLES_FETCHED:
      return action.teamRoles
    default:
      return state
  }
}

export const rolesFetched = teamRoles => ({ type: TEAM_ROLES_FETCHED, teamRoles })

export const fetchTeamRoles = () => dispatch =>
  api.get('/team/roles').then(({ data }) => dispatch(rolesFetched(data)))
