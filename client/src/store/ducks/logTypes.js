import api from '../../services/api'

// Actions
const LOG_TYPES_FETCHED = 'app/logTypes/LOG_TYPES_FETCHED'
const LOG_TYPES_UPDATED = 'app/logTypes/LOG_TYPES_UPDATED'

// Reducer
const defaultState = []

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case LOG_TYPES_FETCHED:
      return [...action.logTypes]
    case LOG_TYPES_UPDATED:
      return [...state, ...action.logTypes]
    default:
      return state
  }
}

// Action creators
export const logTypesFetched = logTypes => ({ type: LOG_TYPES_FETCHED, logTypes })

// Thunks
export const fetchLogTypes = () => async dispatch =>
  api.get(`/event/event-types`).then(({ data }) => dispatch(logTypesFetched(data)))
