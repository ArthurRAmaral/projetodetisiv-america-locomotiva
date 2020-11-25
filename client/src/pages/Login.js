import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'

import LoginForm from '../components/forms/LoginForm'
import LoginLayout from '../layout/LoginLayout'

import * as authStore from '../store/ducks/auth'

function Login({ login }) {
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    document.title = 'Login - Motorman'
  })

  const handleLogin = async values => {
    await login(values)

    // volta o usuário para a página que ele tentou acessar,
    // se foi uma rota do app
    const { from } = location.state || { from: { pathname: '/' } }
    history.replace(from)
  }

  return (
    <LoginLayout>
      <LoginForm onSubmit={handleLogin} />
    </LoginLayout>
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
}

export default connect(null, { login: authStore.login })(Login)
