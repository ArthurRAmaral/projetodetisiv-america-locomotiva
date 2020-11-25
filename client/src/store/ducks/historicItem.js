import api from '../../services/api'

// Actions
const HISTORIC_ITEM_FETCHED = 'app/historicItems/HISTORIC_ITEM_FETCHED'
const HISTORIC_ITEM_CREATED = 'app/historicItems/HISTORIC_ITEM_CREATED'
const HISTORIC_ITEM_UPDATED = 'app/historicItems/HISTORIC_ITEM_UPDATED'
const HISTORIC_ITEM_DELETED = 'app/historicItems/HISTORIC_ITEM_DELETED'

// Reducer
const defaultState = []

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case HISTORIC_ITEM_FETCHED:
      return [...action.historicItems]
    case HISTORIC_ITEM_CREATED:
      return [...state, action.historicItem]
    case HISTORIC_ITEM_UPDATED:
      return state.map(e =>
        e.id === action.historicItem.id ? action.historicItem : e
      )
    case HISTORIC_ITEM_DELETED:
      state.splice(
        state.findIndex(historicItem => historicItem.id === action.id),
        1
      )
      return [...state]
    default:
      return state
  }
}

// Action creators
export const historicItemsFetched = historicItems => ({
  type: HISTORIC_ITEM_FETCHED,
  historicItems
})

export const historicItemDeleted = id => ({ type: HISTORIC_ITEM_DELETED, id })

export const historicItemCreated = historicItem => ({
  type: HISTORIC_ITEM_CREATED,
  historicItem
})

export const historicItemUpdated = historicItem => ({
  type: HISTORIC_ITEM_UPDATED,
  historicItem
})

// Thunks
export const fetchHistoricItemsPerUser = user_id => async dispatch =>
  api
    .get(`/historicitems/peruser/${user_id}`)
    .then(({ data }) => dispatch(historicItemsFetched(data)))

export const deleteHistoricItem = id => async dispatch =>
  api
    .delete(`/historicitems/${id}`)
    .then(({ data }) => dispatch(historicItemDeleted(id)))

export const createHistoricItem = body => async dispatch =>
  api
    .post(`/historicitems`, body)
    .then(({ data }) => dispatch(historicItemCreated(data)))

export const updateHistoricItem = body => async dispatch => {
  return api
    .put(`/historicitems/${body.id}`, body)
    .then(({ data }) => dispatch(historicItemUpdated(data)))
}
