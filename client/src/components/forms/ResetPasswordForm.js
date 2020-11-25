import React from 'react'
import PropTypes from 'prop-types'

import { Row, Col, Typography, Input, Button, Alert, Form } from 'antd'

import { Link } from 'react-router-dom'

import { useForm } from 'antd/lib/form/util'
import rules from './rules'

const { Text, Title, Paragraph } = Typography

function ResetPasswordForm({ onSubmit, loading, successMessage, errorMessage }) {
  const [form] = useForm()

  const handleSubmit = values => {
    const { password, passwordConfirm } = values

    if (password !== passwordConfirm) {
      form.setFields([
        {
          name: 'password',
          errors: ['As senhas não são iguais'],
        },
        {
          name: 'passwordConfirm',
          errors: ['As senhas não são iguais'],
        },
      ])
      return
    }

    onSubmit(password)
  }

  return (
    <Col span={24}>
      <Title level={2}>Redefinição de senha</Title>
      <Paragraph>Preencha os campos abaixo para redefinir sua senha.</Paragraph>
      <Form
        form={form}
        labelCol={{ span: 24, className: 'text-center' }}
        wrapperCol={{ span: 24 }}
        onFinish={handleSubmit}
      >
        <Form.Item label="Senha" name="password" rules={[rules.required]}>
          <Input.Password placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" />
        </Form.Item>

        <Form.Item label="Confirmar senha" name="passwordConfirm" rules={[rules.required]}>
          <Input.Password placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" />
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

ResetPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  successMessage: PropTypes.string,
}

ResetPasswordForm.defaultProps = {
  errorMessage: null,
  successMessage: null,
}

export default ResetPasswordForm
