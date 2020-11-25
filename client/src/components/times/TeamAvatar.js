import React from 'react'
import PropTypes from 'prop-types'
import { Avatar } from 'antd'

function TeamAvatar({ team, size = 32 }) {
  const style = {
    width: size,
    height: size,
    fontSize: size * 0.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return <Avatar style={style} src={team && team.imageUrl} />
}

TeamAvatar.propTypes = {
  team: PropTypes.shape({
    imageUrl: PropTypes.string,
    name: PropTypes.string,
  }),
  size: PropTypes.number,
}

TeamAvatar.defaultProps = {
  team: null,
  size: 32,
}

export default TeamAvatar
