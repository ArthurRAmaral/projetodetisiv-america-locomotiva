import api from '../../services/api'

const PAYMENTS_FETCHED = 'app/payment/PAYMENTS_FETCHED'

const defaultState = []

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case PAYMENTS_FETCHED:
      return [...action.payments]
    default:
      return state
  }
}

export const paymentsFetched = payments => ({
  type: PAYMENTS_FETCHED,
  payments
})

export const fetchPayments = id => dispatch => {
  return api.get(`/payments/plan/${id}`).then(({ data }) => {
    return dispatch(paymentsFetched(data))
  })
}
