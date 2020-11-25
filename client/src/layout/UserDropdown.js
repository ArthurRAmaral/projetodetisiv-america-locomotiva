import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Dropdown, Button, Menu } from 'antd'
import { Link } from 'react-router-dom'
import { UserOutlined, SettingOutlined } from '@ant-design/icons'

import UserAvatar from '../components/user/UserAvatar'
import LogoutButton from '../components/LogoutButton'

const menu = (
  <Menu>
    <Menu.Item>
      <Link to="/app/my-profile/config">
        <SettingOutlined /> Minha conta
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/app/my-profile">
        <UserOutlined /> Meu perfil
      </Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item>
      <LogoutButton />
    </Menu.Item>
  </Menu>
)

function UserDropdown({ currentUser, showName }) {
  return (
    <Dropdown overlay={menu}>
      <Button type="link" className="w-100 h-100">
        <div className="flex" style={{ alignItems: 'center' }}>
          {showName && <div className="mr-sm">{currentUser.nickname}</div>}
          <UserAvatar user={currentUser} />
        </div>
      </Button>
    </Dropdown>
  )
}

UserDropdown.propTypes = {
  currentUser: PropTypes.shape({
    nickname: PropTypes.string,
  }).isRequired,
  showName: PropTypes.bool,
}

UserDropdown.defaultProps = {
  showName: false,
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
})

export default connect(mapStateToProps)(UserDropdown)
