import React from 'react'
import { Tag } from 'antd'
import { Link } from 'react-router-dom'
import { ContactsOutlined } from '@ant-design/icons'

function ConditionTag({ entity }) {
  return entity.condition ? entity.condition.name !== 'Normalizado' ? (
    <Link to={`/app/conditions/${entity.condition_id}`}>
      <Tag icon={<ContactsOutlined />} color={entity.active ? entity.condition.color : 'red'}>
        {entity.active ? entity.condition.name : 'Inativo'}
      </Tag>{' '}
    </Link>
  ) : <></> : (
      <Tag icon={<ContactsOutlined />} color="red">
        NA
      </Tag>
    )
}

export default ConditionTag
