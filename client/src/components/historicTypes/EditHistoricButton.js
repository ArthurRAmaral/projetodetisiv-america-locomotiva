import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import TabContext from '../../pages/Historics/HistoricContext'

function EditHistoricButton({ id }) {
  const addTab = useContext(TabContext)

  return (
    <Button type="link" icon={<EditOutlined />} onClick={() => addTab('4', id, 'edit')}>
      Editar tipo de histórico
    </Button>
  )
}

EditHistoricButton.propTypes = {
  id: PropTypes.number.isRequired,
}

export default EditHistoricButton
