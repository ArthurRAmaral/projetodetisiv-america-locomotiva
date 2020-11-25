import api from '../../services/api'

//Actions
const ROLES_FETCHED = 'app/birthday/ROLES_FETCHED'

// Reducer
const defaultState = []

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case ROLES_FETCHED:
            return action.roles
        default:
            return state
    }
}

export const rolesFetched = roles => ({ type: ROLES_FETCHED, roles })

export const fetchRoles = () => dispatch =>
    api.get('/users/roles').then(({ data }) => dispatch(rolesFetched(data)))

