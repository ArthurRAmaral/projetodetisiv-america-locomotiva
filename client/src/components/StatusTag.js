import React from 'react'
import PropTypes from 'prop-types'
import { Tag } from 'antd'

function StatusTag({ entity }) {
  return <Tag color={entity.active ? 'blue' : 'red'}>{entity.active ? 'Ativo' : 'Inativo'}</Tag>
}

StatusTag.propTypes = {
  entity: PropTypes.shape({
    active: PropTypes.bool,
  }).isRequired,
}

export default StatusTag
