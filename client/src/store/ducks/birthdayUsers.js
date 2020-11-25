import api from '../../services/api'

//Actions
const BIRTHDAY_FETCHED = 'app/birthday/BIRTHDAY_FETCHED'

// Reducer
const defaultState = []

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case BIRTHDAY_FETCHED:
            return action.birthday
        default:
            return state
    }
}

export const birthdayFetched = birthday => ({ type: BIRTHDAY_FETCHED, birthday })

export const fetchBirthday = () => async dispatch => dispatch(birthdayFetched({ birthday: { month: await fetchBirthdayMonth(), today: await fetchBirthdayToday() } }))

const fetchBirthdayMonth = async () => {
    const result = await api.get('/birthday')
    return result.data
}

const fetchBirthdayToday = async () => {
    const result = await api.get('/birthday/today')
    return result.data
}
