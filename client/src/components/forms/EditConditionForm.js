import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Row, Col, Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

import 'rc-color-picker/assets/index.css'
import { Panel as ColorPickerPanel } from 'rc-color-picker'

import rules from './rules'

function EditConditionForm({ condition, onSubmit }) {
  const [form] = Form.useForm()

  const initialValues = condition ? { ...condition } : null
  let color = '#000000'

  const handleFinish = values => {
    values = { ...values, color }
    onSubmit(values)
  }

  function onChange(obj) {
    color = obj.color
  }

  return (
    <Row>
      <Col span={12} offset={6}>
        <Form
          layout="vertical"
          name="condition"
          form={form}
          onFinish={handleFinish}
          initialValues={initialValues}
          scrollToFirstError
        >
          <Form.Item>
            <Form.Item required name="name" label="Nome:" rules={[rules.required]}>
              <Input type="text" />
            </Form.Item>

            <Form.Item label="Cor:">
              <ColorPickerPanel enableAlpha={false} color={color} onChange={onChange} mode="RGB" />
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

EditConditionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  condition: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nome: PropTypes.string,
    color: PropTypes.string,
  }),
}

EditConditionForm.defaultProps = {
  condition: null,
}

export default EditConditionForm
