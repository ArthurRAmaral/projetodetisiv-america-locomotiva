import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, message, Typography } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'

import * as userStore from '../../store/ducks/user'

const { Text } = Typography

class RemoveUserButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      loading: false,
    }
  }

  hideModal = () => this.setState({ modalVisible: false })

  showModal = () => this.setState({ modalVisible: true })

  deleteUser = async () => {
    const { user, removeUser, onUserChange } = this.props

    this.setState({ loading: true })

    try {
      const { payload } = await removeUser(user)

      this.setState({ loading: false, modalVisible: false })
      message.success('Usuário desativado com sucesso!')

      if (typeof onUserChange === 'function') {
        onUserChange(payload)
      }
    } catch (error) {
      message.error('Ocorreu um erro ao tentar desativar o usuário.')
    }
  }

  render() {
    const { loading, modalVisible } = this.state
    const { user } = this.props

    return (
      <>
        <Button icon={<CloseCircleOutlined />} type="link" danger onClick={this.showModal}>
          Desativar usuário
        </Button>
        <Modal
          title="Desativar usuário"
          onCancel={this.hideModal}
          onOk={this.deleteUser}
          cancelButtonProps={{ disabled: loading }}
          confirmLoading={loading}
          closable={!loading}
          keyboard={!loading}
          maskClosable={!loading}
          visible={modalVisible}
        >
          <Text>
            Deseja realmente desativar <Text strong>{user.nickname || user.fullName}</Text>?
          </Text>
        </Modal>
      </>
    )
  }
}

RemoveUserButton.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    nickname: PropTypes.string,
    fullName: PropTypes.string,
  }).isRequired,
  removeUser: PropTypes.func.isRequired,
  onUserChange: PropTypes.func,
}

RemoveUserButton.defaultProps = {
  onUserChange: null,
}

const mapDispatchToProps = {
  removeUser: userStore.removeUser,
}

export default connect(null, mapDispatchToProps)(RemoveUserButton)
