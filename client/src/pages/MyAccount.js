import React, { Component, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Col, Typography, Row, Button, message } from 'antd'
import { Link } from 'react-router-dom'
import { LinkOutlined } from '@ant-design/icons'
import ChangePasswordModal from '../components/user/ChangePasswordModal'
import * as authStore from '../store/ducks/auth'

const { Text, Title } = Typography

function InfoField({ label, value }) {
  useEffect(() => {
    document.title = 'Minha conta - Motorman'
  })

  return (
    <Row className="mb-sm">
      <Col span={12}>
        <Text type="secondary" className="mr-sm">
          {label}
        </Text>
      </Col>
      <Col span={12}>
        <Text>{value}</Text>
      </Col>
    </Row>
  )
}

InfoField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
}

class MyAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      modalLoading: false,
    }
  }

  handlePasswordChange = async values => {
    const { changePassword } = this.props

    this.setState({ modalLoading: true })

    try {
      await changePassword(values)
      this.setState({ modalVisible: false })

      message.success('Sua senha foi alterada com sucesso!')
    } catch (error) {
      message.error(
        'Ocorreu um erro ao tentar alterar a senha. ' +
          'Verifique os dados ou tente novamente mais tarde.'
      )
    }

    this.setState({ modalLoading: false })
  }

  hideModal = () => this.setState({ modalVisible: false })

  showModal = () => this.setState({ modalVisible: true })

  render() {
    const { modalVisible, modalLoading } = this.state
    const { currentUser } = this.props

    return (
      <div>
        <Row>
          <Col span={24}>
            <Title level={2}>Configurações da conta</Title>
          </Col>
          <Col xs={24} lg={12} className="mb-md">
            <InfoField
              label="Meu perfil:"
              value={
                <Link to="/app/my-profile">
                  <LinkOutlined /> Visualizar
                </Link>
              }
            />
            <InfoField label="Meus times:" value="N/D" />
            <InfoField label="E-mail de acesso:" value={currentUser.email} />
            <InfoField
              label="Senha de acesso:"
              value={
                <Button size="small" onClick={this.showModal}>
                  Alterar
                </Button>
              }
            />
          </Col>
        </Row>
        <ChangePasswordModal
          user={currentUser}
          visible={modalVisible}
          loading={modalLoading}
          onSubmit={this.handlePasswordChange}
          onCancel={this.hideModal}
        />
      </div>
    )
  }
}

MyAccount.propTypes = {
  currentUser: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
  changePassword: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
})

const mapDispatchToProps = {
  changePassword: authStore.changePassword,
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount)
