import api from '../../services/api'

// Actions
const HISTORIC_TYPE_USERS_FETCHED =
  'app/historicItems/HISTORIC_TYPE_USERS_FETCHED'

// Reducer
const defaultState = []

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case HISTORIC_TYPE_USERS_FETCHED:
      return [...action.historicTypeUsers]
    default:
      return state
  }
}

// Action
export const historicTypeWithUsersFetched = historicTypeUsers => ({
  type: HISTORIC_TYPE_USERS_FETCHED,
  historicTypeUsers
})

// Thunks
export const fetchHistoricTypeWithUsers = id => async dispatch =>
  api
    .get(`/historictypes/${id}/users`)
    .then(({ data }) => dispatch(historicTypeWithUsersFetched(data)))
