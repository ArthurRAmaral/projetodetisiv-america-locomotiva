import React from 'react'
import PropTypes from 'prop-types'

import { Layout, Grid } from 'antd'
import AppSider from './AppSider'
import Navbar from './Navbar'

const { Content } = Layout

function AppLayout({ children }) {
  const screens = Grid.useBreakpoint()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Navbar />
      <Layout style={{ flex: '1' }}>
        <AppSider />
        <Layout>
          <Content
            style={{
              padding: screens.lg ? '0 20px 8px' : '8px 4px',
              marginTop: screens.lg ? 20 : 0,
              height: '100%',
              overflow: 'auto',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppLayout
