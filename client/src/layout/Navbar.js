import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Layout, Grid, Button } from 'antd'
import { Link } from 'react-router-dom'
import { MenuFoldOutlined, MenuOutlined } from '@ant-design/icons'
import UserDropdown from './UserDropdown'
import logo from '../assets/images/logo.png'
import logoMobile from '../assets/images/logo-mobile.png'

import * as layoutStore from '../store/ducks/layout'

const { Header } = Layout

function Navbar({ layout, toggleSidebarCollapsed }) {
  const screens = Grid.useBreakpoint()

  return (
    <Header
      style={{
        display: 'flex',
        backgroundColor: 'white',
        padding: 0,
        position: 'relative',
        zIndex: 1,
        width: '100%',
      }}
    >
      {!screens.lg && (
        <div>
          <Button
            type="link"
            icon={React.createElement(layout.siderCollapsed ? MenuOutlined : MenuFoldOutlined)}
            onClick={toggleSidebarCollapsed}
          />
        </div>
      )}
      <Link to="/app" className={!screens.lg ? 'd-block mx-auto' : ''}>
        <img
          src={screens.lg ? logo : logoMobile}
          alt="Logo"
          style={{ height: '100%', padding: 8, objectFit: 'contain' }}
        />
      </Link>
      <div className={screens.lg ? 'ml-auto' : ''}>
        <UserDropdown showName={screens.lg} />
      </div>
    </Header>
  )
}

Navbar.propTypes = {
  layout: PropTypes.shape({
    siderCollapsed: PropTypes.bool,
  }).isRequired,
  toggleSidebarCollapsed: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  layout: state.layout,
})

const mapDispatchToProps = {
  toggleSidebarCollapsed: layoutStore.toggleSidebarCollapsed,
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
