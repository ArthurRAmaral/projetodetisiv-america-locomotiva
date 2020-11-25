import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, message, Typography } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'

import * as userStore from '../../store/ducks/user'

const { Text } = Typography

class RestoreUserButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      loading: false,
    }
  }

  hideModal = () => this.setState({ modalVisible: false })

  showModal = () => this.setState({ modalVisible: true })

  handleOk = async () => {
    const { user, restoreUser, onUserChange } = this.props

    this.setState({ loading: true })

    try {
      const { payload } = await restoreUser(user)
      message.success('Usuário ativado com sucesso!')
      this.setState({ modalVisible: false })

      if (typeof onUserChange === 'function') {
        onUserChange(payload)
      }
    } catch (error) {
      message.error('Ocorreu um erro ao tentar ativar o usuário.')
    }

    this.setState({ loading: false })
  }

  render() {
    const { loading, modalVisible } = this.state
    const { user } = this.props

    return (
      <>
        <Button icon={<ReloadOutlined />} type="link" onClick={this.showModal}>
          Ativar usuário
        </Button>
        <Modal
          title="Ativar usuário"
          onCancel={this.hideModal}
          onOk={this.handleOk}
          cancelButtonProps={{ disabled: loading }}
          confirmLoading={loading}
          closable={!loading}
          keyboard={!loading}
          maskClosable={!loading}
          visible={modalVisible}
        >
          <Text>
            Deseja realmente ativar <Text strong>{user.nickname || user.fullName}</Text>?
          </Text>
        </Modal>
      </>
    )
  }
}

RestoreUserButton.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    nickname: PropTypes.string,
    fullName: PropTypes.string,
  }).isRequired,
  restoreUser: PropTypes.func.isRequired,
  onUserChange: PropTypes.func,
}

RestoreUserButton.defaultProps = {
  onUserChange: null,
}

const mapDispatchToProps = {
  restoreUser: userStore.restoreUser,
}

export default connect(null, mapDispatchToProps)(RestoreUserButton)
