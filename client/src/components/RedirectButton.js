import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { Button } from 'antd'

function RedirectButton({ type, path, icon, children }) {
  const history = useHistory()

  return (
    <Button type={type} onClick={() => history.push(path)} icon={icon}>
      {children}
    </Button>
  )
}

RedirectButton.propTypes = {
  type: PropTypes.string,
  path: PropTypes.string.isRequired,
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
}

RedirectButton.defaultProps = {
  type: null,
  icon: null,
}

export default RedirectButton
