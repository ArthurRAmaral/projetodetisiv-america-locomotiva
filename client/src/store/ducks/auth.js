import api from '../../services/api'
import * as auth from '../../services/auth'

// Actions
const LOGGED_IN = 'app/auth/LOGGED_IN'
const LOGGED_OUT = 'app/auth/LOGGED_OUT'
const USER_UPDATED = 'app/auth/USER_UPDATED'
const FORGOT_PASSWORD = 'app/auth/FORGOT_PASSWORD'
const PASSWORD_RESET = 'app/auth/PASSWORD_RESET'
const RESET_PASSWORD_TOKEN_VERIFIED = 'app/auth/RESET_PASSWORD_TOKEN_VERIFIED'

// Reducer
const defaultState = {
  currentUser: null,
  loginDate: null,
}

export default function reducer(state = defaultState, { type, payload }) {
  switch (type) {
    case LOGGED_IN:
      return { ...state, currentUser: payload }

    case FORGOT_PASSWORD:
    case LOGGED_OUT:
      return defaultState

    case USER_UPDATED:
      return { ...state, currentUser: { ...state.currentUser, ...payload } }

    default:
      return state
  }
}

// Action creators

export const userLoggedIn = user => ({ type: LOGGED_IN, payload: user })
export const userLoggedOut = () => ({ type: LOGGED_OUT })
export const userUpdated = user => ({ type: USER_UPDATED, payload: user })
export const forgotPassword = () => ({ type: FORGOT_PASSWORD })
export const passwordReset = () => ({ type: PASSWORD_RESET })
export const resetPasswordTokenVerified = () => ({ type: RESET_PASSWORD_TOKEN_VERIFIED })

// Thunks
export const checkAuthentication = () => async dispatch => {
  if (auth.isAuthenticated()) {
    return api.get('/auth/refresh').then(({ data }) => {
      auth.login(data.token)
      return dispatch(userLoggedIn(auth.getUser()))
    })
  }
  return dispatch(userLoggedOut())
}

export const login = user => dispatch =>
  api.post(`/authenticate`, user).then(({ data }) => {
    auth.login(data.token)
    dispatch(userLoggedIn(auth.getUser()))
  })

export const changePassword = payload => (dispatch, getState) => {
  const {
    auth: { currentUser },
  } = getState()

  return api.post(`/user/${currentUser.id}/change-password`, payload).then(({ data }) => {
    auth.login(data.token)
    dispatch(userLoggedIn(auth.getUser()))
  })
}

export const logout = () => async dispatch => {
  auth.logout()
  dispatch(userLoggedOut())
}

export const requestPasswordRecoveryMail = email => dispatch =>
  api.post(`/forgot-password/request/${email}`).then(() => {
    auth.logout()
    dispatch(forgotPassword())
  })

export const resetPassword = payload => dispatch =>
  api.post(`/forgot-password/reset`, payload).then(() => dispatch(passwordReset()))

export const verifyResetPasswordToken = token => dispatch =>
  api.get(`/forgot-password/verify/${token}`).then(() => dispatch(resetPasswordTokenVerified()))

export const updateSelf = user => dispatch =>
  api.post('/user/self', user).then(({ data }) => {
    auth.login(data.token)
    dispatch(userUpdated(user))
  })

export const updateProfilePicture = file => {
  return dispatch => {
    const formData = new window.FormData()
    formData.append('avatar', file)
    return api
      .post('/user/self/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(({ data }) => {
        // update locally stored token
        auth.login(data.token)
        const { avatarUrl } = auth.getUser()
        dispatch(userUpdated({ avatarUrl }))
      })
  }
}
