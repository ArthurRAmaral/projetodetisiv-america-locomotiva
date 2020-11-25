import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, message, Typography } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as eventsListStore from '../../store/ducks/eventsList'

const { Text } = Typography

class RemoveEventButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      loading: false,
    }
  }

  hideModal = () => this.setState({ modalVisible: false })

  showModal = () => this.setState({ modalVisible: true })

  deleteEvent = async () => {
    const { event, removeEvent, history } = this.props
    const messageKey = 'messageKey'
    this.setState({ loading: true })
 
    try {
      message.loading({ content: 'Aguarde...', key: messageKey, duration: 0 })

      await removeEvent(event.id)

      message.success({ content: 'Evento removido com sucesso!', key: messageKey })

      if (!window.location.href.includes('/app/event/list')) history.push('/app/event/list')

      this.setState({ loading: false, modalVisible: false })
    } catch (error) {
      message.error({
        content: 'Ocorreu um erro ao tentar remover o evento. Tente recarregar a página.',
        key: messageKey,
      })
    }
  }

  render() {
    const { loading, modalVisible } = this.state
    const { event } = this.props

    return (
      <>
        <Button icon={<CloseCircleOutlined />} type="link" danger onClick={this.showModal}>
          Remover evento
        </Button>
        <Modal
          title="Remover evento"
          onCancel={this.hideModal}
          onOk={this.deleteEvent}
          cancelButtonProps={{ disabled: loading }}
          confirmLoading={loading}
          closable={!loading}
          keyboard={!loading}
          maskClosable={!loading}
          visible={modalVisible}
        >
          <Text>
            Deseja realmente remover <Text strong>{event.name}</Text>?
          </Text>
        </Modal>
      </>
    )
  }
}

RemoveEventButton.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  removeEvent: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
}

const mapDispatchToProps = {
  removeEvent: eventsListStore.removeEvent,
}

export default connect(null, mapDispatchToProps)(withRouter(RemoveEventButton))
