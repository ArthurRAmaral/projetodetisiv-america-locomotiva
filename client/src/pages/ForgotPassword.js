import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LoginLayout from '../layout/LoginLayout'
import ForgotPasswordForm from '../components/forms/ForgotPasswordForm'
import * as authStore from '../store/ducks/auth'

class ForgotPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      errorMessage: null,
      successMessage: null,
    }
  }

  handleSubmit = async email => {
    const { requestPasswordRecoveryMail } = this.props

    this.setState({
      loading: true,
      errorMessage: null,
      successMessage: null,
    })

    try {
      await requestPasswordRecoveryMail(email)

      this.setState({
        successMessage:
          'Uma mensagem foi enviada para seu e-mail com as instruções de recuperação de senha. ' +
          `Verifique a caixa de entrada do endereço ${email}.`,
      })
    } catch (error) {
      this.setState({
        errorMessage:
          'Não foi possível solicitar a alteração de senha. ' +
          'Verique o e-mail inserido ou tente novamente mais tarde.',
      })
    }

    this.setState({ loading: false })
  }

  render() {
    const { loading, errorMessage, successMessage } = this.state
    return (
      <LoginLayout>
        <ForgotPasswordForm
          errorMessage={errorMessage}
          successMessage={successMessage}
          loading={loading}
          onSubmit={this.handleSubmit}
        />
      </LoginLayout>
    )
  }
}

ForgotPassword.propTypes = {
  requestPasswordRecoveryMail: PropTypes.func.isRequired,
}

export default connect(null, {
  requestPasswordRecoveryMail: authStore.requestPasswordRecoveryMail,
})(ForgotPassword)
