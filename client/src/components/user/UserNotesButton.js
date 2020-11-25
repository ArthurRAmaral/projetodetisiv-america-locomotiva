import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import { BookOutlined } from '@ant-design/icons'

function UserNotesButton({ innitialText, onClick, shouldShowContent }) {
  return (
    <Button
      type="link"
      icon={<BookOutlined />}
      onClick={() => onClick()}
      style={{ color: '#17a2b8' }}
    >
      {shouldShowContent ? 'Mostrar detalhes' : innitialText}
    </Button>
  )
}

UserNotesButton.propTypes = {
  innitialText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  shouldShowContent: PropTypes.bool.isRequired,
}

export default UserNotesButton
