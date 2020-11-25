import api from '../../services/api'

// Actions
const LOGS_FETCHED = 'app/log/LOGS_FETCHED'
const LOGS_REMOVED = 'app/log/LOGS_REMOVED'

// Reducer
const defaultState = []

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case LOGS_FETCHED:
      return [...action.log]
    case LOGS_REMOVED:
      return state.filter(log => log.id !== action.log.id)
    default:
      return state
  }
}

// Action creators
export const eventsFetched = log => ({ type: LOGS_FETCHED, log })
export const eventsRemoved = log => ({ type: LOGS_REMOVED, log })

// Thunks
export const fetchTeamEvent = teamId => dispatch =>
  api.get(`/event/team/${teamId}`).then(({ data }) => dispatch(eventsFetched(data)))

export const fetchEvents = () => dispatch =>
  api.get(`/event`).then(({ data }) => dispatch(eventsFetched(data)))

export const removeEvent = eventId => dispatch =>
  api.delete(`/event/${eventId}`).then(() => dispatch(eventsRemoved({ id: eventId })))
