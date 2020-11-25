import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, message, Typography } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import * as teamStore from '../../store/ducks/team'

const { Text } = Typography

class RemoveUserTeamButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      loading: false,
    }
  }

  hideModal = () => this.setState({ modalVisible: false })

  showModal = () => this.setState({ modalVisible: true })

  deleteUserTime = async () => {
    const { user, deleteMember } = this.props

    this.setState({ loading: true })

    try {
      await deleteMember(user.id)
      message.success('Membro da equipe removido com sucesso!')
    } catch (error) {
      message.error('Ocorreu um erro ao tentar remover o membro desta equipe.')
    }
  }

  render() {
    const { loading, modalVisible } = this.state
    const { user } = this.props

    return (
      <>
        <Button icon={<CloseCircleOutlined />} type="link" danger onClick={this.showModal}>
          Remover da equipe
        </Button>
        <Modal
          title="Remover membro da equipe"
          onCancel={this.hideModal}
          onOk={this.deleteUserTime}
          cancelButtonProps={{ disabled: loading }}
          confirmLoading={loading}
          closable={!loading}
          keyboard={!loading}
          maskClosable={!loading}
          visible={modalVisible}
        >
          <Text>
            Deseja realmente remover <Text strong>{user.fullName}</Text> da equipe?
          </Text>
        </Modal>
      </>
    )
  }
}

RemoveUserTeamButton.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    fullName: PropTypes.string,
  }).isRequired,
  deleteMember: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
  deleteMember: teamStore.deleteMember,
}

export default connect(null, mapDispatchToProps)(RemoveUserTeamButton)
