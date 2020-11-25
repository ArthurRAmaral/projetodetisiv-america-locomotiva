import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Row, Col, Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

import rules from './rules'

function EditTeamForm({ team, onSubmit }) {
  const [form] = Form.useForm()

  const initialValues = team ? { ...team } : null

  const handleFinish = values => {
    onSubmit(values)
  }

  return (
    <Row>
      <Col span={12} offset={6}>
        <Form
          layout="vertical"
          name="team"
          form={form}
          onFinish={handleFinish}
          initialValues={initialValues}
          scrollToFirstError
        >
          <Form.Item>
            <Form.Item required name="name" label="Nome:" rules={[rules.required]}>
              <Input type="text" />
            </Form.Item>
            <Form.Item required name="description" label="Descrição:" rules={[rules.required]}>
              <Input type="text" />
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

EditTeamForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  team: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nome: PropTypes.string,
    descricao: PropTypes.string,
  }),
}

EditTeamForm.defaultProps = {
  team: null,
}

export default EditTeamForm
