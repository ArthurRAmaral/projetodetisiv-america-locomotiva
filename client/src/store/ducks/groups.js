import api from '../../services/api'

const GROUPS_FETCHED = 'app/groups/GROUPS_FETCHED'

export default function reducer(state = [], action) {
  switch (action.type) {
    case GROUPS_FETCHED:
      return action.groups
    default:
      return state
  }
}

export const groupsFetched = groups => ({ type: GROUPS_FETCHED, groups })

export const fetchGroups = () => dispatch =>
  api.get('/group').then(({ data }) => dispatch(groupsFetched(data)))
