import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button, Form } from 'antd'
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons'

function FilterForm({ form, children, onSubmit, initialValues }) {
  const handleReset = () => {
    Object.keys(form.getFieldsValue()).forEach(key => form.setFieldsValue({ [key]: null }))
    form.submit()
  }

  const handleSubmit = values => {
    const keys = Object.keys(values)
    const query = {}
    keys.forEach(key => {
      if (typeof values[key] === 'number' || Boolean(values[key])) {
        query[key] = values[key]
      }
    })
    onSubmit(query)
  }

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleSubmit}
      initialValues={initialValues}
      className="ant-advanced-search-form"
    >
      {children}
      <Row>
        <Col xs={24} className="mb-sm">
          <Row justify="center">
            <Button
              htmlType="submit"
              size="small"
              icon={<FilterOutlined />}
              type="primary"
              className="mr-md"
            >
              Aplicar filtro
            </Button>
            <Button size="small" icon={<ReloadOutlined />} onClick={handleReset}>
              Limpar
            </Button>
          </Row>
        </Col>
      </Row>
    </Form>
  )
}

FilterForm.propTypes = {
  form: PropTypes.shape({
    submit: PropTypes.func,
    getFieldsValue: PropTypes.func,
    setFieldsValue: PropTypes.func,
    setFields: PropTypes.func,
  }).isRequired,
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  /* eslint-disable-next-line */
  initialValues: PropTypes.object,
}

FilterForm.defaultProps = {
  initialValues: null,
}

export default FilterForm
