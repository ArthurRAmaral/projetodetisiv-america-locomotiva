import api from '../../services/api'

// Actions
const USER_FETCHED = 'app/user/USER_FETCHED'
const USER_UPDATED = 'app/user/USER_UPDATED'
const USER_CREATED = 'app/user/USER_CREATED'

const ANNOTATION_CREATED = 'app/user/ANNOTATION_CREATED'
const ANNOTATION_UPDATED = 'app/user/ANNOTATION_UPDATED'
const ANNOTATION_REMOVED = 'app/user/ANNOTATION_REMOVED'

// Reducer
const defaultState = null

export default function reducer(state = defaultState, { type, payload }) {
  switch (type) {
    case USER_FETCHED:
    case USER_CREATED:
      return { ...payload }
    case USER_UPDATED:
      return { ...state, ...payload }
    case ANNOTATION_CREATED:
      return { ...state, ...state.annotations.push(payload) }
    case ANNOTATION_UPDATED:
      state.annotations.splice(
        state.annotations.findIndex(annotation => annotation.id === payload.id),
        1,
        payload
      )
      return state
    case ANNOTATION_REMOVED:
      state.annotations.splice(
        state.annotations.findIndex(annotation => annotation.id === payload.id),
        1
      )
      return state
    default:
      return state
  }
}

// Action creators
export const userFetched = user => ({ type: USER_FETCHED, payload: user })
export const userUpdated = user => ({ type: USER_UPDATED, payload: user })
export const userCreated = user => ({ type: USER_CREATED, payload: user })

export const annotationCreated = annotation => ({ type: ANNOTATION_CREATED, payload: annotation })
export const annotationUpdated = annotation => ({ type: ANNOTATION_UPDATED, payload: annotation })
export const annotationRemoved = annotation => ({ type: ANNOTATION_REMOVED, payload: annotation })

// Thunks
export const fetchUser = id => dispatch =>
  api.get(`/user/${id}`).then(({ data }) => dispatch(userFetched(data)))

export const removeUser = user => dispatch =>
  api.delete(`/user/${user.id}`).then(() => dispatch(userUpdated({ ...user, active: false })))

export const restoreUser = user => dispatch =>
  api.post(`/user/restore/${user.id}`).then(() => dispatch(userUpdated({ ...user, active: true })))

export const updateUser = user => dispatch =>
  api.put(`/user/${user.id}`, user).then(() => dispatch(userUpdated(user)))

export const createUser = user => dispatch =>
  api.post(`/user`, user).then(({ data }) => dispatch(userCreated(data)))

export const createUserAnnotation = newAnnotation => dispatch =>
  api
    .post(`/user/${newAnnotation.userId}/annotation`, newAnnotation)
    .then(({ data }) => dispatch(annotationCreated(data)))

export const updateUserAnnotation = annotation => dispatch =>
  api
    .put(`/user/${annotation.userId}/annotation/${annotation.id}`, annotation)
    .then(({ data }) => dispatch(annotationUpdated(data)))

export const removeUserAnnotation = annotation => dispatch =>
  api
    .delete(`/user/${annotation.userId}/annotation/${annotation.id}`, annotation)
    .then(() => dispatch(annotationRemoved(annotation)))
