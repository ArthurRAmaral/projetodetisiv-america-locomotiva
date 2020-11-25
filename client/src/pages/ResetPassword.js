import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Col, Typography, Skeleton, Modal } from 'antd'
import { withRouter } from 'react-router-dom'
import LoginLayout from '../layout/LoginLayout'
import ResetPasswordForm from '../components/forms/ResetPasswordForm'

import * as authStore from '../store/ducks/auth'

const { Paragraph } = Typography

class ResetPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      verifying: true,
      loading: false,
      errorMessage: null,
      successMessage: null,
      token: null,
    }
  }

  componentDidMount = async () => {
    const { verifyResetPasswordToken, match } = this.props
    const { params } = match
    const { token } = params
    document.title = 'Resetar senha - Motorman'

    try {
      await verifyResetPasswordToken(token)
    } catch (error) {
      Modal.warning({
        title: 'Link inválido',
        okText: 'Fechar',
        centered: true,
        content: (
          <div>
            O link de redefinição atual já foi utilizado ou expirou.&nbsp;
            <a href="/forgot-password">Clique aqui</a> para solicitar outro link.
          </div>
        ),
      })
    }

    this.setState({ token, verifying: false })
  }

  handleSubmit = async password => {
    const { resetPassword } = this.props
    const { token } = this.state

    this.setState({
      loading: true,
      errorMessage: null,
      successMessage: null,
    })

    try {
      await resetPassword({ token, password })

      this.setState({
        successMessage: (
          <div>
            Sua senha foi alterada com sucesso.&nbsp;
            <a href="/login">Clique aqui</a> para entrar no sistema.
          </div>
        ),
      })
    } catch (error) {
      this.setState({
        errorMessage:
          'Não foi possível solicitar a alteração de senha. ' +
          'Verique se o link é válido ou tente novamente mais tarde.',
      })
    }

    this.setState({ loading: false })
  }

  render() {
    const { verifying, loading, errorMessage, successMessage } = this.state
    return (
      <LoginLayout>
        {verifying ? (
          <Col span={24}>
            <Paragraph>Verificando link. Aguarde...</Paragraph>
            <Skeleton active />
          </Col>
        ) : (
          <ResetPasswordForm
            onSubmit={this.handleSubmit}
            loading={loading}
            errorMessage={errorMessage}
            successMessage={successMessage}
          />
        )}
      </LoginLayout>
    )
  }
}

ResetPassword.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  verifyResetPasswordToken: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string,
    }),
  }).isRequired,
}

export default connect(null, {
  resetPassword: authStore.resetPassword,
  verifyResetPasswordToken: authStore.verifyResetPasswordToken,
})(withRouter(ResetPassword))
