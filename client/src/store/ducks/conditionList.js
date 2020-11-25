import api from '../../services/api'

const CONDITIONS_FETCHED = 'app/conditions/CONDITIONS_FETCHED'
const CONDITION_REMOVED = 'app/conditions/CONDITIONS_REMOVED'
const CONDITION_FETCHED = 'app/conditions/CONDITION_FETCHED'
const CONDITION_UPDATED = 'app/conditions/CONDITION_UPDATED'
const CONDITION_CREATED = 'app/conditions/CONDITION_CREATED'

const defaultState = []

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case CONDITIONS_FETCHED:
      return action.conditions
    case CONDITION_REMOVED:
      return action.condition
    case CONDITION_FETCHED:
      return action.condition
    case CONDITION_UPDATED:
      return action.condition
    case CONDITION_CREATED:
      return action.condition
    default:
      return state
  }
}

export const conditionRemoved = condition => ({ type: CONDITION_REMOVED, condition })
export const conditionsFetched = conditions => ({ type: CONDITIONS_FETCHED, conditions })
export const conditionFetched = condition => ({ type: CONDITION_FETCHED, condition })
export const conditionUpdated = condition => ({ type: CONDITION_UPDATED, condition })
export const conditionCreated = condition => ({ type: CONDITION_CREATED, condition })

export const fetchConditions = () => dispatch =>
  api.get('/conditions').then(({ data }) => dispatch(conditionsFetched(data)))
export const fetchCondition = conditionId => dispatch =>
  api.get(`/conditions/${conditionId}`).then(({ data }) => dispatch(conditionFetched(data)))
export const removeCondition = conditionId => dispatch =>
  api
    .delete(`/conditions/${conditionId}`)
    .then(() => dispatch(conditionRemoved({ id: conditionId })))
export const updateCondition = condition => dispatch =>
  api
    .put(`/conditions/${condition.id}`, condition)
    .then(() => dispatch(conditionUpdated(condition)))
export const createCondition = condition => dispatch =>
  api.post(`/conditions`, condition).then(() => dispatch(conditionCreated(condition)))
