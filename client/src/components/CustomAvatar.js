import React from 'react'
import PropTypes from 'prop-types'
import { Avatar } from 'antd'

function CustomAvatar({ avatar, size = 32 }) {
  const style = {
    width: size,
    height: size,
    fontSize: size * 0.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return <Avatar style={style} src={avatar} />
}

CustomAvatar.propTypes = {
  avatar: PropTypes.string.isRequired,
  size: PropTypes.number,
}

CustomAvatar.defaultProps = {
  // avatar: 'https://api.adorable.io/avatars/285/motorman',
  size: 32,
}

export default CustomAvatar
