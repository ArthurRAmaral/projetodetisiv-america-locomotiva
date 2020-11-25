import React from 'react'
import { PageHeader, Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { logout } from '../services/auth'

function AppHeader() {
  return (
    <PageHeader
      title="Motorman"
      subTitle="América Locomotiva Futebol Americano"
      extra={[<LogoutButton key="logout" />]}
    />
  )
}

function LogoutButton() {
  const history = useHistory()

  const handleLogout = () => {
    logout()
    history.push('/')
  }
  return (
    <Button type="link" onClick={handleLogout}>
      Sair&nbsp;
      <LogoutOutlined />
    </Button>
  )
}

export default AppHeader
