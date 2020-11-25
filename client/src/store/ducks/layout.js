// Actions
const LAYOUT_UPDATED = 'app/layout/LAYOUT_UPDATED'

// Reducer
const defaultState = {
  theme: 'light',
  siderCollapsed: false,
}

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
    case LAYOUT_UPDATED:
      return { ...defaultState, ...action.config }
    default:
      return state
  }
}

// Action creators
export const updateLayout = config => ({ type: LAYOUT_UPDATED, config })

export const changeTheme = themeName => ({ type: LAYOUT_UPDATED, config: { theme: themeName } })

export const setSidebarCollapsed = collapsed => ({
  type: LAYOUT_UPDATED,
  config: { siderCollapsed: collapsed },
})

export const toggleSidebarCollapsed = () => (dispatch, getState) =>
  dispatch(setSidebarCollapsed(!getState().layout.siderCollapsed))
