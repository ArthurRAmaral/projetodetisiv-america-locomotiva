import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import TabContext from '../../pages/Event/EventContext'

function EditEventButton({ id }) {
  const addTab = useContext(TabContext)

  return (
    <Button
      type="link"
      icon={<EditOutlined />}
      onClick={() => addTab('4', id, 'edit')}
    >
      Editar evento
    </Button>
  )
}

EditEventButton.propTypes = {
  id: PropTypes.number.isRequired,
}

export default EditEventButton
