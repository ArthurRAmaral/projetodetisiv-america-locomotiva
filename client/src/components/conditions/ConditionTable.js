import React, { useContext } from 'react'
import PropTypes, { arrayOf } from 'prop-types'
import { Link } from 'react-router-dom'
import { Table, Tag, Dropdown, Menu, Button } from 'antd'

import { ToolOutlined } from '@ant-design/icons'

import RemoveConditionButton from './RemoveConditionButton'
import TabContext from '../../pages/Condition/ConditionContext'

const filterColumns = (columns, filteredColumns) => {
  return columns.filter(column => !filteredColumns.includes(column.key))
}

function ConditionTable({
  loading,
  conditions,
  filteredColumns,
  additionalColumns,
  tableProperties,
}) {
  const addTab = useContext(TabContext)

  const columns = [
    {
      key: 'name',
      title: 'Nome',
      dataIndex: 'name',
      fixed: 'left',
      render: (value, record) => (
        <Link onClick={() => addTab('3', record.id, 'details')} to={`/app/conditions/${record.id}`}>
          {record.name}
        </Link>
      ),
    },
    {
      key: 'color',
      title: 'Cor',
      render: record => <Tag color={record.color}>{record.color}</Tag>,
    },
    {
      key: 'options',
      title: '',
      render: (value, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>
                {React.createElement(RemoveConditionButton, {
                  condition: record,
                })}
              </Menu.Item>
            </Menu>
          }
        >
          <Button type="link">
            <ToolOutlined />
          </Button>
        </Dropdown>
      ),
    },
    ...additionalColumns,
  ]

  return (
    <Table
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...tableProperties}
      size="small"
      loading={loading}
      columns={filterColumns(columns, filteredColumns)}
      dataSource={conditions.map(u => ({ ...u, key: u.id }))}
    />
  )
}

ConditionTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  conditions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    })
  ).isRequired,
  filteredColumns: arrayOf(PropTypes.string),
  additionalColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.any,
    })
  ),
  tableProperties: PropTypes.shape(),
}

ConditionTable.defaultProps = {
  filteredColumns: [],
  additionalColumns: [],
  tableProperties: null,
}

export default ConditionTable
