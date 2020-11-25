import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as navigationStore from '../store/ducks/navigation'

function MenuNavigationRouter({ path, changeRoute, children }) {
  useEffect(() => {
    changeRoute(path)
  })
  return <>{children}</>
}

MenuNavigationRouter.propTypes = {
  path: PropTypes.shape({
    activeMenu: PropTypes.string,
    activeSubMenu: PropTypes.string,
  }),
  changeRoute: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.object]).isRequired,
}

MenuNavigationRouter.defaultProps = {
  path: {},
}

const mapDispatchToProps = {
  changeRoute: navigationStore.changeRoute,
}

export default connect(null, mapDispatchToProps)(MenuNavigationRouter)
