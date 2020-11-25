import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { LogoutOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'

import * as authStore from '../store/ducks/auth'

function LogoutButton({ logout }) {
  const history = useHistory()

  const handleLogout = () => {
    logout().then(() => history.push('/'))
  }

  return (
    <div onKeyPress={handleLogout} onClick={handleLogout} role="button" tabIndex={0}>
      <LogoutOutlined /> Sair
    </div>
  )
}

LogoutButton.propTypes = {
  logout: PropTypes.func.isRequired,
}

export default connect(null, {
  logout: authStore.logout,
})(LogoutButton)
