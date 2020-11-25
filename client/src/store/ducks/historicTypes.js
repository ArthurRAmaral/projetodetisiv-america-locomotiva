import api from '../../services/api'

// Actions
const HISTORIC_TYPES_FETCHED = 'app/historicTypes/HISTORIC_TYPES_FETCHED'
const HISTORIC_TYPES_UPDATED = 'app/historicTypes/HISTORIC_TYPES_UPDATED'
const HISTORIC_TYPES_DELETED = 'app/historicTypes/HISTORIC_TYPES_DELETED'
const HISTORIC_TYPES_CREATED = 'app/historicTypes/HISTORIC_TYPES_CREATED'

// Reducer
const defaultState = []

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case HISTORIC_TYPES_FETCHED:
      return [...action.historicTypes]
    case HISTORIC_TYPES_UPDATED:
      return state.map(e =>
        e.id === action.historicType.id ? action.historicType : e
      )
    case HISTORIC_TYPES_DELETED:
      return [...state.filter(e => e.id !== action.historicTypeID)]
    case HISTORIC_TYPES_CREATED:
      state.push(action.historicType)
      return [...state]
    default:
      return state
  }
}

// Action creators
export const historicTypesFetched = historicTypes => ({
  type: HISTORIC_TYPES_FETCHED,
  historicTypes
})

// Action creators
export const historicTypeDeleted = historicTypeID => ({
  type: HISTORIC_TYPES_DELETED,
  historicTypeID
})

// Action creators
export const historicTypeCreated = historicType => ({
  type: HISTORIC_TYPES_CREATED,
  historicType
})

// Action creators
export const historicTypeUpdated = historicType => ({
  type: HISTORIC_TYPES_UPDATED,
  historicType
})

// Thunks
export const fetchHistoricTypes = () => async dispatch =>
  api
    .get(`/historictypes/all`)
    .then(({ data }) => dispatch(historicTypesFetched(data)))

// Thunks
export const deleteHistoricType = id => async dispatch =>
  api
    .delete(`/historictypes/${id}`)
    .then(() => dispatch(historicTypeDeleted(id)))

// Thunks
export const createHistoricType = body => async dispatch =>
  api
    .post(`/historictypes`, body)
    .then(({ data }) => dispatch(historicTypeCreated(data)))

// Thunks
export const updateHistoricType = body => async dispatch =>
  api
    .put(`/historictypes/${body.id}`, body)
    .then(({ data }) => dispatch(historicTypeUpdated(data)))
