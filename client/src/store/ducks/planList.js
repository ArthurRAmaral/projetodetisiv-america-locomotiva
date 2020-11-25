import api from '../../services/api'
// Actions
const PLANS_FETCHED = 'app/plans/PLANS_FETCHED'
const PLAN_CREATED = 'app/plans/PLAN_CREATED'
const PLAN_UPDATED = 'app/plans/PLAN_UPDATED'
const PLAN_REMOVED = 'app/plans/PLAN_REMOVED'

// Reducer
const defaultState = []

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case PLANS_FETCHED:
      return [...action.plans]
    case PLAN_CREATED:
      return [...state, action.plan]
    case PLAN_UPDATED: {
      const { id, ...rest } = action.plan
      const plans = [...state]
      const index = plans.findIndex(u => u.id === id)
      const plan = plans[index]
      plans.splice(index, 1, { ...plan, ...rest })
      return plans
    }
    default:
      return state
  }
}

// Action creators
export const plansFetched = plans => ({ type: PLANS_FETCHED, plans })
export const planCreated = plan => ({ type: PLAN_CREATED, plan })
export const planUpdated = plan => ({ type: PLAN_UPDATED, plan })
export const planRemoved = plan => ({ type: PLAN_REMOVED, plan })

// Thunks
export const fetchPlans = () => dispatch =>
  api.get('/plan').then(({ data }) => dispatch(plansFetched(data)))

export const createPlan = plan => dispatch =>
  api.post('/plan', plan).then(({ data }) => dispatch(planCreated({ ...data, active: true })))

export const updatePlan = plan => dispatch =>
  api.put(`/plan/${plan.id}`, plan).then(() => dispatch(planUpdated(plan)))

export const removePlan = id => dispatch =>
  api.delete(`/plan/${id}`).then(() => dispatch(planUpdated({ id, active: false })))

export const restorePlan = id => dispatch =>
  api.post(`/plan/${id}/restore`).then(() => dispatch(planUpdated({ id, active: true })))
