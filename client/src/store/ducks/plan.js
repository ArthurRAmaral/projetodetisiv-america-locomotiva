import api from '../../services/api'

// Actions
const PLAN_FETCHED = 'app/plan/PLAN_FETCHED'
const PLAN_UPDATED = 'app/plan/PLAN_UPDATED'

// Reducer
const defaultState = []

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case PLAN_FETCHED:
      return { ...action.plan }
    case PLAN_UPDATED:
      return { ...state, ...action.plan }
    default:
      return state
  }
}

// Action creators
export const planFetched = plan => ({ type: PLAN_FETCHED, plan })
export const planUpdated = plan => ({ type: PLAN_UPDATED, plan })

// Thunks
export const fetchPlan = id => dispatch =>
  api.get(`/plan/${id}`).then(({ data }) => dispatch(planFetched(data)))

export const removePlan = id => dispatch =>
  api.delete(`/plan/${id}`).then(() => dispatch(planUpdated({ id, active: false })))

export const restorePlan = id => dispatch =>
  api.post(`/plan/${id}/restore`).then(() => dispatch(planUpdated({ id, active: true })))

export const updatePlan = plan => dispatch =>
  api.put(`/plan/${plan.id}`, plan).then(() => dispatch(planUpdated(plan)))
