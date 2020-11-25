import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Select } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import DecimalInput from '../masked-inputs/DecimalInput'
import DateInput from '../masked-inputs/DateInput'
import rules from '../forms/rules'

function PlanEditModal({
  payment,
  visible,
  planValue,
  planUsers,
  onSubmit,
  onCancel
}) {
  const formRef = React.createRef()

  const inicialValues = payment
    ? {
        ...payment,
        value: payment.value ? parseFloat(payment.value) : 0,
        due_date: payment.due_date
          ? new Date(payment.due_date).toLocaleDateString('pt-br')
          : ''
      }
    : {
        value: planValue ? planValue : 0
      }

  useEffect(() => {
    if (formRef.current) {
      formRef.current.resetFields()
    }
  }, [formRef])

  const handleSubmit = () => {
    const values = formRef.current.getFieldsValue()
    if (!values.value) {
      values.value = planValue ? planValue : 0
    }
    if (!values.user_id) {
      values.user_id = [planUsers[0].id]
    }
    const dates = values.due_date.split('/')
    values.due_date = new Date(dates[2], dates[1] - 1, dates[0])
    onSubmit({
      ...values
    })
  }

  return (
    <Modal
      okText="Salvar"
      okButtonProps={{ icon: <SaveOutlined /> }}
      onOk={handleSubmit}
      onCancel={onCancel}
      visible={visible}
      title={payment ? 'Editar mensalidade' : 'Criar mensalidade'}
    >
      <Form
        ref={formRef}
        initialValues={inicialValues}
        layout="vertical"
        name="plan"
      >
        <Form.Item
          name="due_date"
          wrapperCol={{ md: 12 }}
          label="Data de vencimento"
          rules={[rules.required]}
        >
          <DateInput />
        </Form.Item>
        <Form.Item
          name="value"
          wrapperCol={{ md: 12 }}
          label="Valor (R$)"
          rules={[rules.required]}
        >
          <DecimalInput
            defaultValue={payment ? payment.value : planValue ? planValue : 10}
            placeholder="0,00"
          />
        </Form.Item>
        {planUsers?.length > 1 ? (
          <Form.Item rules={[rules.required]} name="user_id" label="Usuário">
            <Select mode="multiple">
              {planUsers.map(user => (
                <Select.Option key={user.id} value={user.id}>
                  {user.fullName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <Form.Item name="user_id" label="Usuário">
            <Input disabled placeholder="Nome do usuário" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

PlanEditModal.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.number
  }),
  visible: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

PlanEditModal.defaultProps = {
  plan: null
}

export default PlanEditModal
