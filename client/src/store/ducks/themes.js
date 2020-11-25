// Actions
const CHANGE = 'app/theme/CHANGE'

// Reducer
const defaultState = {
  theme: 'light',
}

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
    case CHANGE:
      return { ...state, theme: action.theme }
    default:
      return state
  }
}

// Action creators
export const changeTheme = theme => ({ type: CHANGE, theme })
export const setDarkTheme = () => changeTheme('dark')
export const setLightTheme = () => changeTheme('light')
