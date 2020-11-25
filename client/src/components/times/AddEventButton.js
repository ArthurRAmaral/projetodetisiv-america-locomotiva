import React from 'react'
import { Button } from 'antd'
import { UsergroupAddOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'

function AddEventButton() {
  const history = useHistory()

  return (
    <Button
      type="primary"
      onClick={() => history.push({ pathname: `/app/event`, state: { render: '2' } })}
      icon={<UsergroupAddOutlined />}
    >
      Adicionar evento
    </Button>
  )
}

export default AddEventButton
