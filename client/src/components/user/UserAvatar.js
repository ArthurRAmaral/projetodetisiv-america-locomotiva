import React from 'react'
import PropTypes from 'prop-types'
import { Avatar } from 'antd'

function UserAvatar({ user, style, size = 32 }) {
  const defaultStyle = {
    width: size,
    height: size,
    fontSize: size * 0.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return <Avatar style={{ ...defaultStyle, ...style }} src={user.avatarUrl} />
}

UserAvatar.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    email: PropTypes.string,
    fullName: PropTypes.string,
  }),
  size: PropTypes.number,
  /* eslint-disable-next-line */
  style: PropTypes.object,
}

UserAvatar.defaultProps = {
  user: null,
  size: 32,
  style: null,
}

export default UserAvatar
