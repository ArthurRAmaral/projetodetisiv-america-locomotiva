import React from 'react'
import {
  Table,
  Button,
  Row,
  Col,
  message,
  Tag,
  Checkbox,
  Dropdown,
  Menu
} from 'antd'
import { CheckOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column'
import { Link } from 'react-router-dom'
import Api from '../../services/api'

import moment from 'moment'

import { formatToBRLCurrency } from '../../util/numberUtil'

class UserTutionTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: props.user,
      checkedList: [],
      indeterminate: false,
      checkAll: false
    }

    this.plainOptions = this.state.user.payments
    this.defaultCheckedList = [this.state.user.payments[0]]
  }



  setPaid = async id => {
    const { payments } = this.state.user

    const payment = payments.find(p => p.id === id)
    payment.paid = true
    payment.payment_date = new Date()

    const messageKey = 'messageKey'

    message.loading({ content: 'Aguarde...', key: messageKey, duration: 0 })

    try {
      await Api.put(`payments/${payment.id}`, {
        ...payment
      })

      message.success({ content: 'Chamada realizada!!', key: messageKey })
    } catch (error) {
      message.error({
        content:
          'Ocorreu um erro ao realizar a chamada. Você está conectado à internet?',
        key: messageKey
      })
    }

    this.setState({ payments })
  }

  setNotPaid = async id => {
    const { payments } = this.state.user

    const payment = payments.find(p => p.id === id)
    payment.paid = false
    payment.payment_date = null

    const messageKey = 'messageKey'

    message.loading({ content: 'Aguarde...', key: messageKey, duration: 0 })

    try {
      await Api.put(`payments/${payment.id}`, {
        ...payment
      })

      message.success({ content: 'Chamada realizada!!', key: messageKey })
    } catch (error) {
      message.error({
        content:
          'Ocorreu um erro ao realizar a chamada. Você está conectado à internet?',
        key: messageKey
      })
    }

    this.setState({ payments })
  }

  onChange = (event, payment) => {
    const addAtCheckedList = () => {
      const { checkedList } = this.state
      const newArray = [...checkedList]
      newArray.push(payment)
      return newArray
    }
    const removeFromCheckedList = () => {
      const { checkedList } = this.state
      const newArray = [...checkedList].filter(item => item !== payment)
      return newArray
    }

    const list = event.target.checked
      ? addAtCheckedList()
      : removeFromCheckedList()

    this.setState({
      checkedList: list,
      indeterminate: !!list.length && list.length < this.plainOptions.length,
      checkAll: list.length === this.plainOptions.length
    })
  }

  onCheckAllChange = e => {
    this.setState({
      checkedList: e.target.checked ? this.plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked
    })
  }

  setSelectionPaid = async () => {
    const { checkedList } = this.state
    checkedList.forEach(checked => this.setPaid(checked.id))
  }

  setSelectionNotPaid = async () => {
    const { checkedList } = this.state
    checkedList.forEach(checked => this.setNotPaid(checked.id))
  }

  isLate = date => {
    return new Date(date) < new Date()
  }

  getCheckedListaValue = () => {
    let sum = 0
    this.state.checkedList.forEach(item => {
      sum += parseFloat(item.value)
    })
    return formatToBRLCurrency(sum)
  }

  sortPayments = () => {
    let payments = this.state.user.payments.sort((a,b) => {
      if (a.due_date.valueOf() > b.due_date.valueOf()) {
        return 1
      } else if (a.due_date.valueOf() < b.due_date.valueOf()) {
        return -1
      } else {
        return 0
      }
    })
    return payments
  }

  menu = (
    <Menu>
      <Menu.Item>
        <Button type={'primary'} onClick={() => this.setSelectionPaid()}>
          Marcar todos como pago
          <CheckOutlined />
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button
          danger
          type={'primary'}
          onClick={() => this.setSelectionNotPaid()}
        >
          Marcar todos como não pago
          <CloseOutlined />
        </Button>
      </Menu.Item>
    </Menu>
  )
  render() {
    const { checkedList, indeterminate, checkAll } = this.state
    return (
      <>
        <Table
          scroll={{ x: 'auto' }}
          rowKey="id"
          size="small"
          dataSource={this.sortPayments()}
        >
          <Column
            title={
              <Checkbox
                indeterminate={indeterminate}
                onChange={this.onCheckAllChange}
                checked={checkAll}
              />
            }
            dataIndex="Selection"
            render={(value, record) => (
              <Checkbox
                onChange={e => this.onChange(e, record)}
                checked={checkedList.includes(record)}
              />
            )}
          />

          <Column
            title="Plano"
            dataIndex="Plan"
            render={(value, record) => (
              <Link to={`/app/plan`}>{this.state.user.plan.name}</Link>
            )}
          />

          <Column
            title="Valor"
            dataIndex="value"
            render={(value, record) => <p>{record.value}</p>}
          />

          <Column
            title="Vencimento"
            dataIndex="due_date"
            render={(value, record) => (
              <p>{moment(record.due_date).format('DD/MM/YYYY')}</p>
            )}
          />

          <Column
            title="Data de pagamento"
            dataIndex="payment_date"
            render={(value, record) =>
              record.payment_date ? (
                <p>{moment(record.payment_date).format('DD/MM/YYYY HH:mm')}</p>
              ) : (
                  <p>Sem Data</p>
                )
            }
          />

          <Column
            title="status"
            dataIndex="presence"
            render={(value, record) =>
              record.paid ? (
                <Tag color={'green'}>Pago</Tag>
              ) : this.isLate(record.due_date) ? (
                <Tag color={'red'}>Atrasado</Tag>
              ) : (
                    <Tag color={'gold'}>Não pago</Tag>
                  )
            }
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

        {checkedList.length > 0 ? (
          <>
            <Row>
              <Col style={{ marginRight: '25px' }}>
                <h1>Total selecionado: {this.getCheckedListaValue()}</h1>
              </Col>
              <Col>
                <Dropdown overlay={this.menu} placement="bottomLeft">
                  <Button>
                    Ações
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </Col>
            </Row>
          </>
        ) : null}
      </>
    )
  }
}

export default UserTutionTable
