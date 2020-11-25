import React, { useState } from 'react'
import { Form, Input, Row, Col, Button } from 'antd'
import { connect } from 'react-redux'
import { SaveOutlined } from '@ant-design/icons'
import { Panel as ColorPickerPanel } from 'rc-color-picker'
import * as hytoricTypeStore from '../../store/ducks/historicTypes'

import rules from './rules'

function EditHistoricTypeForm({ historicTypes, historicTypeId, onSubmit, fetchHistoricTypes }) {
  const [form] = Form.useForm()

  const [fetched, setFetched] = useState(false)

  if (!fetched) {
    fetchHistoricTypes().then(() => form.resetFields())
    setFetched(true)
  }

  const { type, description, color } = historicTypes.find(
    e => e.id === parseInt(historicTypeId)
  ) || { type: '', description: '' }

  const [colorSelect, setColor] = useState(color)

  const handleFinish = values => {
    values = {
      ...values,
      color: colorSelect,
      id: parseInt(historicTypeId),
    }
    onSubmit(values)
  }

  const colorPickHandle = colorPickerObject => {
    setColor(colorPickerObject.color)
  }

  return (
    <Row>
      <Col span={12} offset={6}>
        <Form
          layout="vertical"
          name="historicType"
          form={form}
          onFinish={handleFinish}
          initialValues={{ type, description }}
          scrollToFirstError
        >
          <Form.Item>
            <Form.Item
              required
              name="type"
              label="Nome do tipo:"
              rules={[rules.required]}
              value={type}
            >
              <Input type="text" />
            </Form.Item>

            <Form.Item
              required
              name="description"
              label="Descrição:"
              rules={[rules.required]}
              value={description}
            >
              <Input type="text" />
            </Form.Item>
          </Form.Item>

          <Form.Item label="Cor:">
            <ColorPickerPanel
              enableAlpha={false}
              color={colorSelect}
              mode="RGB"
              onChange={colorPickHandle}
            />
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

const mapStateToProps = state => ({
  historicTypes: state.historicTypes,
})

const mapDispatchToProps = {
  fetchHistoricTypes: hytoricTypeStore.fetchHistoricTypes,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditHistoricTypeForm)
