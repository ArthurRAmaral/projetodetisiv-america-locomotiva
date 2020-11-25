import api from '../../services/api'

const EXPECTETIONS_FETCHED = 'app/dashboardData/EXPECTETIONS_FETCHED'

const defaultState = { expectetions: [] }

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case EXPECTETIONS_FETCHED:
      return { ...state, expectetions: [...action.expectations] }
    default:
      return state
  }
}

export const expectationsFetched = expectations => ({
  type: EXPECTETIONS_FETCHED,
  expectations
})

export const fetchExpectations = () => dispatch => {
  return api.get('/payments/dashboard/expectations').then(({ data }) => {
    return dispatch(expectationsFetched(data))
  })
}
