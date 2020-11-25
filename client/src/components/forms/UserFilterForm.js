import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Col, Row, Select } from 'antd'
import FilterForm from '../FilterForm'

function UserFilterForm({ onSubmit, values, plans }) {
  const [form] = Form.useForm()

  // Usando este state para o antd não reclamar que estamos executando o hook
  // antes de vinculá-lo ao Form
  const [atached, setAtached] = useState(false)

  useEffect(() => {
    if (atached) {
      // resetando os campos para o valor inicial se o valor inicial se alterar
      form.resetFields()
    } else {
      setAtached(true)
    }
  }, [form, values, atached])

  const initialValues = {
    plan_id: null,
    active: null,
    ...values,
  }

  return (
    <FilterForm form={form} initialValues={initialValues} onSubmit={onSubmit}>
      <Row gutter={16}>
        <Col xs={24} md={12} lg={6}>
          <Form.Item name="nickname" label="Apelido">
            <Input allowClear placeholder="Apelido do usuário" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Form.Item name="fullName" label="Nome completo">
            <Input allowClear placeholder="Nome do usuário" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={4}>
          <Form.Item name="active" label="Status">
            <Select>
              <Select.Option value={null}>Todos</Select.Option>
              <Select.Option value="1">Ativo</Select.Option>
              <Select.Option value="0">Inativo</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Form.Item name="plan_id" label="Plano">
            <Select>
              <Select.Option value={null}>Todos</Select.Option>
              {plans.map(plan => (
                <Select.Option key={plan.id} value={plan.id}>
                  {plan.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </FilterForm>
  )
}

UserFilterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ).isRequired,
  values: PropTypes.shape({
    fullName: PropTypes.string,
    nickname: PropTypes.string,
    active: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    plan_id: PropTypes.string,
  }),
}

UserFilterForm.defaultProps = {
  values: null,
}

export default UserFilterForm
