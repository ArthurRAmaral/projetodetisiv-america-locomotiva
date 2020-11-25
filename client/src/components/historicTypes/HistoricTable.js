import React, { useContext } from 'react'
import PropTypes, { arrayOf } from 'prop-types'
import { Table, Dropdown, Menu, Button, Tag } from 'antd'

import { ToolOutlined } from '@ant-design/icons'

import EditHistoricButton from './EditHistoricButton'
import RemoveHistoricTypeButton from './RemoveHistoricTypeButton'
import { Link } from 'react-router-dom'
import TabContext from '../../pages/Historics/HistoricContext'

const filterColumns = (columns, filteredColumns) => {
  return columns.filter(column => !filteredColumns.includes(column.key))
}

function HistoricTable({
  loading,
  historicTypes,
  filteredColumns,
  additionalColumns,
  tableProperties
}) {
  const addTab = useContext(TabContext)

  const columns = [
    {
      key: 'name',
      title: 'Nome',
      dataIndex: 'name',
      fixed: 'left',
      render: (value, record) => (
        <Link
          onClick={() => addTab('3', record.id, 'detail')}
          to={`/app/historics/${record.id}`}
        >
          {record.type}
        </Link>
      )
    },
    {
      key: 'description',
      title: 'Descrição',
      render: record => record.description
    },
    {
      key: 'color',
      title: 'Cor',
      render: record => <Tag color={record.color}>{record.color}</Tag>
    },
    {
      key: 'options',
      title: '',
      render: (value, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>
                <EditHistoricButton id={record.id} />
              </Menu.Item>
              <Menu.Item>
                <RemoveHistoricTypeButton historicType={record} />
              </Menu.Item>
            </Menu>
          }
        >
          <Button type="link">
            <ToolOutlined />
          </Button>
        </Dropdown>
      )
    },
    ...additionalColumns
  ]

  return (
    <Table
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...tableProperties}
      size="small"
      loading={loading}
      columns={filterColumns(columns, filteredColumns)}
      dataSource={historicTypes.map(element => ({
        ...element,
        key: element.id
      }))}
    />
  )
}

HistoricTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  historicTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number
    })
  ).isRequired,
  filteredColumns: arrayOf(PropTypes.string),
  additionalColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.any
    })
  ),
  tableProperties: PropTypes.shape()
}

HistoricTable.defaultProps = {
  filteredColumns: [],
  additionalColumns: [],
  tableProperties: null
}

export default HistoricTable
