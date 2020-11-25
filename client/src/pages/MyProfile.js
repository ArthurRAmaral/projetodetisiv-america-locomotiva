import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, Space, Col, Row, Menu, Button, Modal, message } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { Link, useLocation, Route, Switch } from 'react-router-dom'

import * as authStore from '../store/ducks/auth'

import UserDescription from '../components/user/UserDescription'
import UserAvatar from '../components/user/UserAvatar'
import ProfilePicUpload from '../components/user/ProfilePicUpload'
import EditUserForm from '../components/forms/EditUserForm'
import MyAccount from './MyAccount'

function MyProfile({ currentUser, updateSelf }) {
  const [editVisible, setEditVisible] = useState(false)
  const [editAvatarVisible, setEditAvatarVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.title = 'Meu perfil - Motorman'
  })

  const key = 'MyProfile'

  const handleFormSubmit = async values => {
    try {
      message.loading({ content: 'Atualizando...', key })
      await updateSelf(values)
      setEditVisible(false)
      message.success({ content: 'Alterações realizadas com sucesso!', key })
    } catch (error) {
      message.error({
        content:
          'Ocorreu um erro ao tentar atualizar suas informações. Por favor, tente novamente.',
        key,
      })
    }
  }

  return (
    <Card>
      <Row gutter={24} justify="center">
        <Col xs={24} className="mb-lg">
          <Menu mode="horizontal" selectedKeys={[location.pathname]}>
            <Menu.Item key="/app/my-profile">
              <Link to="/app/my-profile">Perfil</Link>
            </Menu.Item>
            <Menu.Item key="/app/my-profile/history">
              <Link to="/app/my-profile/history">Histórico</Link>
            </Menu.Item>
            <Menu.Item key="/app/my-profile/config">
              <Link to="/app/my-profile/config">Configurações</Link>
            </Menu.Item>
          </Menu>
        </Col>

        <Col xs={24} lg={16} xl={16}>
          <Switch>
            <Route exact path="/app/my-profile">
              <Space direction="vertical" size="large" align="center">
                <UserAvatar size={140} user={currentUser} />
                <Button type="default" size="small" onClick={() => setEditAvatarVisible(true)}>
                  Atualizar foto
                </Button>
                <Button type="link" icon={<EditOutlined />} onClick={() => setEditVisible(true)}>
                  Atualizar minhas informações
                </Button>
                <UserDescription user={currentUser} />
              </Space>
            </Route>
            <Route exact path="/app/my-profile/history">
              Histórico
            </Route>
            <Route exact path="/app/my-profile/config">
              <MyAccount />
            </Route>
          </Switch>
        </Col>
      </Row>
      <Modal visible={editVisible} footer={false} onCancel={() => setEditVisible(false)}>
        <EditUserForm user={currentUser} onSubmit={handleFormSubmit} />
      </Modal>
      <Modal
        title="Atualizar foto de perfil"
        visible={editAvatarVisible}
        footer={false}
        onCancel={() => setEditAvatarVisible(false)}
      >
        <ProfilePicUpload onSuccess={() => setEditAvatarVisible(false)} />
      </Modal>
    </Card>
  )
}

MyProfile.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  updateSelf: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
})

const mapDispatchToProps = {
  updateSelf: authStore.updateSelf,
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile)
