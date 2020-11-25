import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Typography, Input, Button, Alert, Form } from 'antd'

import { Link } from 'react-router-dom'

import rules from './rules'

const { Text, Title, Paragraph } = Typography

function ForgotPasswordForm({ onSubmit, loading, errorMessage, successMessage }) {
  const handleSubmit = values => onSubmit(values.email)

  return (
    <Col span={24}>
      <Title level={2}>Esqueci minha senha</Title>
      <Paragraph>Insira abaixo seu e-mail para solicitar a redefinição de senha.</Paragraph>
      <Form
        labelCol={{ span: 24, className: 'text-center' }}
        wrapperCol={{ span: 24 }}
        onFinish={handleSubmit}
      >
        <Form.Item label="E-mail" name="email" rules={[rules.required, rules.email]}>
          <Input placeholder="email@exemplo.com" />
        </Form.Item>

        <Form.Item>
          <Row justify="center">
            <Col span={24}>
              <Button block size="large" type="primary" htmlType="submit" loading={loading}>
                Enviar
              </Button>
            </Col>
          </Row>
        </Form.Item>

        <Col className="mb-md" span={24}>
          {errorMessage && <Text type="danger">{errorMessage}</Text>}
          {successMessage && <Alert type="success" message={successMessage} showIcon />}
        </Col>
      </Form>
      <Link to="/login">Já sei minha senha</Link>
    </Col>
  )
}

ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  successMessage: PropTypes.string,
}

ForgotPasswordForm.defaultProps = {
  errorMessage: null,
  successMessage: null,
}

export default ForgotPasswordForm
