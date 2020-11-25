import api from '../../services/api'

//Actions
const AGE_RANGE_FETCHED = '/app/users/AGE_RANGE_FETCHED'

//Reducer
const defaultState = []

export default function reducer(state = defaultState, action) {
    switch(action.type) {
        case AGE_RANGE_FETCHED:
            return action.users
        default: 
            return state
    }
}

export const usersFetched = users => ({type: AGE_RANGE_FETCHED, users})

export const fetchUsers = () => dispatch => api.get('users/ranges').then(({data}) => dispatch(usersFetched(data)))
