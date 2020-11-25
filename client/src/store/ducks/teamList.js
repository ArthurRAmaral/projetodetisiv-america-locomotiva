import api from '../../services/api'
import * as teamStore from './team'

// Actions
const TEAM_LIST_FETCHED = 'app/teams/TEAM_LIST_FETCHED'
const TEAM_UPDATED = 'app/teams/TEAM_UPDATED'

// Reducer
const defaultState = []

export default function reducer(state = defaultState, { type, payload }) {
  switch (type) {
    case TEAM_LIST_FETCHED:
      return [...payload]
    case TEAM_UPDATED: {
      const { id, ...rest } = payload
      const teams = [...state]
      const index = teams.findIndex(u => u.id === id)
      const team = teams[index]
      teams.splice(index, 1, { ...team, ...rest })
      return teams
    }
    default:
      return state
  }
}

// Action creators
export const teamListFetched = teams => ({ type: TEAM_LIST_FETCHED, payload: teams })
export const teamUpdated = team => ({ type: TEAM_UPDATED, payload: team })

// Thunks
export const fetchTeamList = () => dispatch =>
  api.get('/team').then(({ data }) => dispatch(teamListFetched(data)))

export const fetchTeamListWithMembers = () => dispatch =>
  api.get('/team/members').then(({ data }) => dispatch(teamListFetched(data)))

export const updateTeam = team => dispatch =>
  teamStore.updateTeam(team).then(({ payload }) => dispatch(teamUpdated(payload)))
