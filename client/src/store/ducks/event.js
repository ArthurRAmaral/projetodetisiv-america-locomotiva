import api from '../../services/api'

// Actions
const LOG_FETCHED = 'app/log/LOG_FETCHED'
const LOG_CREATED = 'app/log/LOG_CREATED'
const LOG_UPDATED = 'app/log/LOG_UPDATED'
const LOG_REMOVED = 'app/log/LOG_REMOVED'

// Reducer
const defaultState = []

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case LOG_FETCHED:
      return action.log
    default:
      return state
  }
}

// Action creators
export const eventCreated = log => ({ type: LOG_CREATED, log })

// TODO
export const eventFetched = log => ({ type: LOG_FETCHED, log })
export const eventUpdated = log => ({ type: LOG_UPDATED, log })
export const eventRemoved = log => ({ type: LOG_REMOVED, log })

// Thunks
export const createTeamEvent = eventData => dispatch => api.post(`/event`, eventData)
export const fetchEvent = id => dispatch =>
  api.get(`/event/${id}`).then(({ data }) => dispatch(eventFetched(data)))

// TODO
export const removeEvent = eventId => dispatch =>
  api.delete(`/event/${eventId}`).then(() => dispatch(eventRemoved({ log: { id: eventId } })))
// TODO
export const updatedEvent = eventData => dispatch =>
  api.put(`/event/${eventData.id}`, eventData).then(({ data }) => dispatch(eventFetched(data)))
