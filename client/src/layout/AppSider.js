import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu, Grid } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { DashboardOutlined } from '@ant-design/icons'

import * as layoutStore from '../store/ducks/layout'

import AdminMenu from './AdminMenu'
import TeamsMenu from './TeamsMenu'

const { Sider } = Layout

function AppSider({ currentUser, layout, setSidebarCollapsed, navigation }) {
  const screens = Grid.useBreakpoint()
  const { activeMenu, activeSubMenu } = navigation

  return (
    <Sider
      theme={layout.theme}
      collapsedWidth={screens.lg ? 80 : 0}
      collapsed={layout.siderCollapsed}
      breakpoint="lg"
      onBreakpoint={setSidebarCollapsed}
    >
      <Menu mode="inline" theme={layout.theme} selectedKeys={[activeMenu, activeSubMenu]}>
        <Menu.Item key="/app" icon={<DashboardOutlined />}>
          <Link to="/app">DashBoard</Link>
        </Menu.Item>
        <TeamsMenu currentUser={currentUser} />
        <AdminMenu currentUser={currentUser} />
      </Menu>
    </Sider>
  )
}

AppSider.propTypes = {
  layout: PropTypes.shape({
    theme: PropTypes.string,
    siderCollapsed: PropTypes.bool,
  }).isRequired,
  navigation: PropTypes.shape({
    activeMenu: PropTypes.string,
    activeSubMenu: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  setSidebarCollapsed: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
  return {
    layout: state.layout,
    navigation: state.navigation,
    currentUser: state.auth.currentUser,
  }
}

const mapDispatchToProps = {
  setSidebarCollapsed: layoutStore.setSidebarCollapsed,
}

export default connect(mapStateToProps, mapDispatchToProps)(AppSider)
