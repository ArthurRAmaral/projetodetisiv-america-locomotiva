import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import DecimalInput from '../masked-inputs/DecimalInput'
import { parseNumber } from '../../util/numberUtil'
import rules from '../forms/rules'

function PlanEditModal({ plan, visible, onSubmit, onCancel }) {
  // Para atualizar dinamicamente a propriedade initialValues do Form de maneira correta, é necessário
  // invocar o método resetFields quando a propriedade plan é atualizada.
  // Veja aqui: https://ant.design/components/form/#Form.Item
  //
  // Em condições normais, deve-se usar o hook useForm() em um function component,
  // mas aqui precisamos saber se o FormInstance já foi atribuido ao Form antes de invocar
  //  o método resetFields, por isso estou utilizando ref.
  const formRef = React.createRef()

  // Resetar o form para initialValues assim que o plan for atualizado
  useEffect(() => {
    if (formRef.current) {
      formRef.current.resetFields()
    }
  }, [plan, formRef])

  const handleSubmit = () => {
    const values = formRef.current.getFieldsValue()
    const { monthlyPrice } = values
    onSubmit({
      ...plan,
      ...values,
      monthlyPrice: parseNumber(monthlyPrice),
    })
  }

  return (
    <Modal
      okText="Salvar"
      okButtonProps={{ icon: <SaveOutlined /> }}
      onOk={handleSubmit}
      onCancel={onCancel}
      visible={visible}
      title={plan ? 'Editar plano de pagamento' : 'Cadastrar plano de pagamento'}
    >
      <Form ref={formRef} initialValues={plan} layout="vertical" name="plan">
        <Form.Item name="name" label="Nome" required rules={[rules.required]}>
          <Input placeholder="Nome do plano" />
        </Form.Item>
        <Form.Item
          name="monthlyPrice"
          wrapperCol={{ md: 12 }}
          label="Valor mensal (R$)"
          rules={[rules.required]}
        >
          <DecimalInput placeholder="0,00" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

PlanEditModal.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.number,
  }),
  visible: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

PlanEditModal.defaultProps = {
  plan: null,
}

export default PlanEditModal
