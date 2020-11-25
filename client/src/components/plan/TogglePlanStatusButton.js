import React from 'react'
import PropTypes from 'prop-types'
import { Popconfirm, Button } from 'antd'
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons'

function TogglePlanStatusButton({ plan, onDeleteClick, onRestoreClick }) {
  return plan.active ? (
    <Popconfirm title="O plano será desativado. Tem certeza?" onConfirm={() => onDeleteClick(plan)}>
      <Button size="small" type="link" icon={<DeleteOutlined />} danger>
        Desativar
      </Button>
    </Popconfirm>
  ) : (
    <Popconfirm
      title="O plano será restaurado. Tem certeza?"
      onConfirm={() => onRestoreClick(plan)}
    >
      <Button size="small" type="link" icon={<ReloadOutlined />}>
        Restaurar
      </Button>
    </Popconfirm>
  )
}

TogglePlanStatusButton.propTypes = {
  plan: PropTypes.shape({
    active: PropTypes.bool,
  }).isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onRestoreClick: PropTypes.func.isRequired,
}

export default TogglePlanStatusButton
