/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import PropTypes from 'prop-types'
import {
  AuditOutlined,
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  ContactsOutlined,
  ProfileOutlined
} from '@ant-design/icons'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import { userHasPermission } from '../services/access-control'

function AdminMenu({ currentUser, ...props }) {
  return (
    userHasPermission(currentUser, 'application/users/manage') && (
      <Menu.SubMenu
        {...props}
        key="admin"
        title="Administração"
        icon={<AuditOutlined />}
      >
        <Menu.Item key="/app/user">
          <UserOutlined />
          <Link to="/app/user?active=1">Usuários</Link>
        </Menu.Item>
        <Menu.Item key="/app/team">
          <TeamOutlined />
          <Link to="/app/team">Times</Link>
        </Menu.Item>
        <Menu.Item key="/app/plan">
          <DollarOutlined />
          <Link to="/app/plan">Planos</Link>
        </Menu.Item>
        <Menu.Item key="/app/event">
          <CalendarOutlined />
          <Link to="/app/event">Eventos</Link>
        </Menu.Item>
        <Menu.Item key="/app/conditions">
          <ContactsOutlined />
          <Link to="/app/conditions">Condições</Link>
        </Menu.Item>
        <Menu.Item key="/app/calendar">
          <CalendarOutlined />
          <Link to="/app/calendar">Calendário</Link>
        </Menu.Item>
        <Menu.Item key="/app/historics">
          <ProfileOutlined />
          <Link to="/app/historics">Históricos</Link>
        </Menu.Item>
      </Menu.SubMenu>
    )
  )
}

AdminMenu.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number
  }).isRequired
}

export default AdminMenu
