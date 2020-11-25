import api from '../../services/api'
import * as userStore from './user'

// Actions
const USERS_FETCHED = 'app/users/USERS_FETCHED'
const USER_UPDATED = 'app/users/USER_UPDATED'

// Reducer
const defaultState = {
  total: '0',
  perPage: 20,
  lastPage: null,
  page: 1,
  data: [],
}

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case USERS_FETCHED:
      return action.results
    case USER_UPDATED: {
      const { id, ...rest } = action.user
      const users = [...state.data]
      const index = users.findIndex(u => u.id === id)
      const user = users[index]
      users.splice(index, 1, { ...user, ...rest })
      return { ...state, data: users }
    }
    default:
      return state
  }
}

// Action creators
export const usersFetched = results => ({ type: USERS_FETCHED, results })
export const userUpdated = user => ({ type: USER_UPDATED, user })

// Thunks
export const fetchUsers = params => dispatch =>
  api.get('/user', { params }).then(({ data }) => dispatch(usersFetched(data)))

export const updateUser = user => dispatch =>
  userStore.updateUser(user).then(({ payload }) => dispatch(userUpdated(payload)))

export const searchUsers = params => dispatch =>
  api.get(`/user/search`, { params }).then(({ data }) => dispatch(usersFetched(data)))
