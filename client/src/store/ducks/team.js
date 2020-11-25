import api from '../../services/api'

// Actions
const TEAM_FETCHED = 'app/team/TEAM_FETCHED'
const TEAM_UPDATED = 'app/team/TEAM_UPDATED'
const TEAM_CREATED = 'app/team/TEAM_CREATED'
const MEMBER_REMOVED = 'app/team/MEMBER_REMOVED'
const MEMBER_ADDED = 'app/team/MEMBER_ADDED'
const MEMBERS_ADDED = 'app/team/MEMBERS_ADDED'

// Reducer
const defaultState = null

export default function reducer(state = defaultState, { type, payload }) {
  switch (type) {
    case TEAM_FETCHED:
    case TEAM_CREATED:
      return { ...payload }
    case TEAM_UPDATED:
      return { ...state, ...payload }
    case MEMBER_ADDED:
      return { ...state, members: [...state.members, payload] }
    case MEMBERS_ADDED:
      return { ...state, members: [...state.members, ...payload] }
    case MEMBER_REMOVED: {
      const { members } = state
      const list = [...members]
      const pos = members.findIndex(m => m.user_id === payload)
      list.splice(pos, 1)
      return { ...state, members: list }
    }
    default:
      return state
  }
}

// Action creators
export const teamFeched = team => ({ type: TEAM_FETCHED, payload: team })
export const teamUpdated = team => ({ type: TEAM_UPDATED, payload: team })
export const teamCreated = team => ({ type: TEAM_CREATED, payload: team })
export const memberRemoved = userId => ({ type: MEMBER_REMOVED, payload: userId })
export const memberAdded = member => ({ type: MEMBER_ADDED, payload: member })
export const membersAdded = members => ({ type: MEMBERS_ADDED, payload: members })

// Thunks
export const fetchTeam = id => dispatch =>
  api.get(`/team/${id}`).then(({ data }) => dispatch(teamFeched(data)))

export const removeTeam = team => dispatch =>
  api.delete(`/team/${team.id}`).then(() => dispatch(teamUpdated({ ...team, active: false })))

export const restoreTeam = team => dispatch =>
  api.put(`/team/restore/${team.id}`).then(() => dispatch(teamUpdated({ ...team, active: true })))

export const updateTeam = team => dispatch =>
  api.put(`/team/${team.id}`, team).then(() => dispatch(teamUpdated(team)))

export const createTeam = team => dispatch =>
  api.post(`/team`, team).then(({ data }) => dispatch(teamCreated(data)))

export const uploadImage = file => async (dispatch, getState) => {
  const { team } = getState()
  const formData = new window.FormData()
  formData.append('image', file)
  const { data } = await api.post(`/team/${team.id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return dispatch(teamUpdated({ imageUrl: data.imageUrl }))
}

export const addMember = payload => async (dispatch, getState) => {
  const { team } = getState()
  const { data } = await api.post(`/team/${team.id}/member/${payload.user_id}`, payload)
  return dispatch(memberAdded(data))
}

export const addMembers = members => async (dispatch, getState) => {
  const { team } = getState()
  const { data } = await api.post(`/team/${team.id}/members`, members)
  return dispatch(membersAdded(data))
}

export const deleteMember = userId => async (dispatch, getState) => {
  const { team } = getState()
  await api.delete(`/team/${team.id}/member/${userId}`)
  return dispatch(memberRemoved(userId))
}
