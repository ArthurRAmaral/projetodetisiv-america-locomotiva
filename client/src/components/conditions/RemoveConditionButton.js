import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, message, Typography } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as conditionListStore from '../../store/ducks/conditionList'

const { Text } = Typography

class RemoveConditionButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      loading: false,
    }
  }

  hideModal = () => this.setState({ modalVisible: false })

  showModal = () => this.setState({ modalVisible: true })

  deleteCondition = async () => {
    const { condition, removeCondition, history } = this.props
    const messageKey = 'messageKey'
    this.setState({ loading: true })

    try {
      message.loading({ content: 'Aguarde...', key: messageKey, duration: 0 })

      await removeCondition(condition.id)

      message.success({ content: 'Condição removida com sucesso!', key: messageKey })

      history.push('/app/conditions/')

      this.setState({ loading: false, modalVisible: false })
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          message.error({
            content: 'Não é possível remover uma condição presente em algum usuário',
            key: messageKey,
          })
        } else if (error.response.status === 404) {
          message.error({
            content: 'Condição já removida',
            key: messageKey,
          })
        } else {
          message.error({
            content: `Ocorreu um erro ${error.response.status} ao tentar remover a condição. `,
            key: messageKey,
          })
        }
      } else {
        message.error({
          content: 'Ocorreu um erro ao tentar remover a condição. Tente recarregar a página.',
          key: messageKey,
        })
      }
      this.setState({ loading: false })
      this.hideModal()
    }
  }

  render() {
    const { loading, modalVisible } = this.state

    return (
      <>
        <Button icon={<CloseCircleOutlined />} type="link" danger onClick={this.showModal}>
          Remover condição
        </Button>
        <Modal
          title="Remover condição"
          onCancel={this.hideModal}
          onOk={this.deleteCondition}
          cancelButtonProps={{ disabled: loading }}
          confirmLoading={loading}
          closable={!loading}
          keyboard={!loading}
          maskClosable={!loading}
          visible={modalVisible}
        >
          <Text>
            Deseja realmente remover a condição "<Text strong>{this.props.condition.name}</Text>"?
          </Text>
        </Modal>
      </>
    )
  }
}

RemoveConditionButton.propTypes = {
  condition: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  removeCondition: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
}

const mapDispatchToProps = {
  removeCondition: conditionListStore.removeCondition,
}

export default connect(null, mapDispatchToProps)(withRouter(RemoveConditionButton))
