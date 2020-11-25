import React from 'react'
import { Link } from 'react-router-dom'

import {
  Table,
  Button,
  Row,
  Col,
  message,
  Dropdown,
  Menu,
  Modal,
  Typography
} from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  ToolOutlined,
  EditOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import Column from 'antd/lib/table/Column'
import PaymentModal from './PaymentModal'
import Api from '../../services/api'
import moment from 'moment'

const { Text } = Typography

class PaymentTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      payments: [],
      editModalVisible: false,
      deleteModalVisible: false,
      loadingDeleteModal: false,
      selectedPayment: null
    }
  }

  update = record => {
    this.showEditModal()
    this.setState({ selectedPayment: record })
  }

  hideEditModal = () => this.setState({ editModalVisible: false })

  showEditModal = () => this.setState({ editModalVisible: true })

  updatePayment = async values => {
    const { selectedPayment, payments } = this.state

    const messageKey = 'updateMessageKey'

    message.loading({ content: 'Aguarde...', key: messageKey, duration: 0 })

    try {
      selectedPayment.value = values.value
      selectedPayment.due_date = values.due_date

      await Api.put(`payments/${selectedPayment.id}`, {
        ...selectedPayment
      })
      const index = payments.indexOf(selectedPayment)

      payments[index] = selectedPayment

      this.hideEditModal()

      this.setState({ payments })

      message.success({ content: 'Mensalidade atualizada!!', key: messageKey })
    } catch (error) {
      this.setState({ editModalVisible: false })

      message.error({
        content:
          'Ocorreu um erro ao atualizar a mensalidade. Você está conectado à internet?',
        key: messageKey
      })
    }
  }

  delete = record => {
    this.showDeleteModal()
    this.setState({ selectedPayment: record })
  }

  hideDeleteModal = () => this.setState({ deleteModalVisible: false })

  showDeleteModal = () => this.setState({ deleteModalVisible: true })

  deletePayment = async () => {
    this.setState({ loadingDeleteModal: true })
    const { selectedPayment, payments } = this.state

    const messageKey = 'deleteMessageKey'

    message.loading({ content: 'Aguarde...', key: messageKey, duration: 0 })

    try {
      await Api.delete(`payments/${selectedPayment.id}`)

      this.setState({
        loadingDeleteModal: false,
        deleteModalVisible: false,
        payments: payments.filter(p => p.id !== selectedPayment.id)
      })

      message.success({ content: 'Mensalidade deletada!!', key: messageKey })
    } catch (error) {
      this.setState({ loadingDeleteModal: false, deleteModalVisible: false })

      message.error({
        content:
          'Ocorreu um erro ao deletar a mensalidade. Você está conectado à internet?',
        key: messageKey
      })
    }
  }

  componentDidMount = () => {
    const now = moment()
    let payments = this.props.payments.filter(
      payment =>
        moment(payment.due_date).valueOf() >= now.valueOf() && !payment.paid
    )
    payments = payments.sort((a, b) => {
      if (a.due_date.valueOf() > b.due_date.valueOf()) {
        return 1
      } else if (a.due_date.valueOf() < b.due_date.valueOf()) {
        return -1
      } else {
        return 0
      }
    })
    this.setState({
      payments
    })
  }

  setPaid = async id => {
    const { payments } = this.state

    const payment = payments.find(p => p.id === id)
    payment.paid = true
    payment.payment_date = new Date()

    const messageKey = 'messageKey'

    message.loading({ content: 'Aguarde...', key: messageKey, duration: 0 })

    try {
      await Api.put(`payments/${payment.id}`, {
        ...payment
      })

      message.success({ content: 'Mensalidade paga', key: messageKey })
    } catch (error) {
      message.error({
        content:
          'Ocorreu um erro ao atualizar a mensalidade. Você está conectado à internet?',
        key: messageKey
      })
    }

    this.setState({ payments })
  }

  setNotPaid = async id => {
    const { payments } = this.state

    const payment = payments.find(p => p.id === id)
    payment.paid = false
    payment.payment_date = null

    const messageKey = 'messageKey'

    message.loading({ content: 'Aguarde...', key: messageKey, duration: 0 })

    try {
      await Api.put(`payments/${payment.id}`, {
        ...payment
      })

      message.success({ content: 'Mensalidade não paga', key: messageKey })
    } catch (error) {
      message.error({
        content:
          'Ocorreu um erro ao atualizar a mensalidade. Você está conectado à internet?',
        key: messageKey
      })
    }

    this.setState({ payments })
  }

  render() {
    const {
      loadingDeleteModal,
      deleteModalVisible,
      editModalVisible
    } = this.state
    return (
      <div>
        <Table
          scroll={{ x: 'auto' }}
          rowKey="id"
          size="small"
          dataSource={this.state.payments}
        >
          <Column
            title="Nome"
            dataIndex="name"
            render={(value, record) => (
              <Link
                to={{
                  pathname: `/app/user/`,
                  state: { render: '3', id: record.user_id, nameId: 'details' }
                }}
              >
                {record.user.fullName}
              </Link>
            )}
          />

          <Column
            title="Email"
            dataIndex="email"
            render={(value, record) => <p>{record.user.email}</p>}
          />

          <Column
            title="Criação"
            dataIndex="created_at"
            render={(value, record) => (
              <p>{moment(record.created_at).format('DD/MM/YYYY')}</p>
            )}
          />

          <Column
            title="Vencimento"
            dataIndex="due_date"
            render={(value, record) => (
              <p>{moment(record.due_date).format('DD/MM/YYYY')}</p>
            )}
          />

          <Column
            title="Valor"
            dataIndex="value"
            render={(value, record) => <p>{record.value}</p>}
          />

          <Column
            title="Opções"
            dataIndex="options"
            render={(value, record) => (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => this.update(record)}
                      >
                        Editar Pagamento
                      </Button>
                    </Menu.Item>
                    <Menu.Item>
                      <Button
                        icon={<CloseCircleOutlined />}
                        type="link"
                        danger
                        onClick={() => this.delete(record)}
                      >
                        Deletar Pagamento
                      </Button>
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button type="link">
                  <ToolOutlined />
                </Button>
              </Dropdown>
            )}
          />

          <Column
            title="Pagamento"
            dataIndex="paid"
            width={100}
            render={(value, record) => {
              return (
                <Row>
                  <Col xs={12}>
                    <Button
                      type={record.paid ? 'primary' : 'dashed'}
                      shape="circle"
                      onClick={() => this.setPaid(record.id)}
                    >
                      <CheckOutlined />
                    </Button>
                  </Col>
                  <Col xs={12}>
                    <Button
                      danger
                      type={!record.paid ? 'primary' : 'dashed'}
                      shape="circle"
                      onClick={() => this.setNotPaid(record.id)}
                    >
                      <CloseOutlined />
                    </Button>
                  </Col>
                </Row>
              )
            }}
          />
        </Table>
        <Modal
          title="Remover mensalidade"
          onCancel={this.hideDeleteModal}
          onOk={this.deletePayment}
          cancelButtonProps={{ disabled: loadingDeleteModal }}
          confirmLoading={loadingDeleteModal}
          closable={!loadingDeleteModal}
          keyboard={!loadingDeleteModal}
          maskClosable={!loadingDeleteModal}
          visible={deleteModalVisible}
        >
          <Text>
            Deseja realmente remover a mensalidade de{' '}
            <Text strong>
              {this.state.selectedPayment
                ? `${this.state.selectedPayment.user.fullName}`
                : '[Nome não reconhecido]'}
            </Text>
            ?
          </Text>
        </Modal>
        <PaymentModal
          visible={editModalVisible}
          onCancel={this.hideEditModal}
          onSubmit={this.updatePayment}
          payment={this.state.selectedPayment}
        />
      </div>
    )
  }
}

export default PaymentTable
