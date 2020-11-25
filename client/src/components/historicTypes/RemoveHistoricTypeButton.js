import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, message, Typography } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as historicTypesStore from '../../store/ducks/historicTypes'

const { Text } = Typography

class RemoveHistoricTypeButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      loading: false
    }
  }

  hideModal = () => this.setState({ modalVisible: false })

  showModal = () => this.setState({ modalVisible: true })

  deleteHistoricType = async () => {
    const { historicType, deleteHistoricType, history } = this.props
    const messageKey = 'messageKey'

    try {
      this.setState({ loading: true })
      message.loading({ content: 'Aguarde...', key: messageKey, duration: 0 })

      await deleteHistoricType(historicType.id)

      // this.setState({ loading: false, modalVisible: false })
      message.success({
        content: 'Condição removida com sucesso!',
        key: messageKey
      })

      history.push('/app/historics/list')
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 500:
            message.error({
              content:
                'Não foi possível remover o tipo de histórico selecionado, verifique sua conexão.',
              key: messageKey
            })
            break
          case 400:
            message.error({
              content:
                'Os dados para a remoção não foram enviados corretamente.',
              key: messageKey
            })
            break
          case 404:
            message.error({
              content:
                'Não foi enontrado o tipo de histórico que deseja remover.',
              key: messageKey
            })
            break
          default:
            message.error({
              content: `Ocorreu um erro ${error.response.status} ao tentar remover o tipo de hitórico. `,
              key: messageKey
            })
            break
        }
      } else {
        message.error({
          content:
            'Ocorreu um erro ao tentar remover a condição. Tente recarregar a página.',
          key: messageKey
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
        <Button
          icon={<CloseCircleOutlined />}
          type="link"
          danger
          onClick={this.showModal}
        >
          Remover tipo de histórico
        </Button>
        <Modal
          title="Remover tipo de histórico"
          onCancel={this.hideModal}
          onOk={this.deleteHistoricType}
          cancelButtonProps={{ disabled: loading }}
          confirmLoading={loading}
          closable={!loading}
          keyboard={!loading}
          maskClosable={!loading}
          visible={modalVisible}
        >
          <Text>
            Deseja realmente remover esse tipo de histórico "
            <Text strong>{this.props.historicType.type}</Text>"?
          </Text>
        </Modal>
      </>
    )
  }
}

RemoveHistoricTypeButton.propTypes = {
  historicType: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.string,
    description: PropTypes.string
  }).isRequired,
  deleteHistoricType: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
}

const mapDispatchToProps = {
  deleteHistoricType: historicTypesStore.deleteHistoricType
}

export default connect(
  null,
  mapDispatchToProps
)(withRouter(RemoveHistoricTypeButton))
