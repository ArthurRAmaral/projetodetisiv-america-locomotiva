import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Typography } from 'antd'
import rules from '../forms/rules'

const { Text } = Typography

function ChangePasswordModal({ visible, loading, onSubmit, onCancel, user }) {
  const [form] = Form.useForm()

  const handleModalOk = () => {
    form.submit()
  }

  return (
    <Modal
      title="Alterar senha de acesso"
      okText="Alterar senha"
      closable={!loading}
      closeIcon={!loading}
      maskClosable={!loading}
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      onCancel={onCancel}
      onOk={handleModalOk}
      visible={visible}
    >
      <Text>Preencha o formulário abaixo para alterar a sua senha de acesso ao sistema:</Text>

      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="email" noStyle>
          <Input type="hidden" value={user.email} />
        </Form.Item>
        <Form.Item label="Senha atual:" name="currentPassword" rules={[rules.required]}>
          <Input.Password placeholder="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" />
        </Form.Item>
        <Form.Item label="Nova senha:" name="password" rules={[rules.required]}>
          <Input.Password placeholder="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

ChangePasswordModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
}

export default ChangePasswordModal
