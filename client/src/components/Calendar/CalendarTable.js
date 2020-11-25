import React from 'react'
import PropTypes, { arrayOf } from 'prop-types'
import { Link } from 'react-router-dom'
import { Table } from 'antd'

function TeamTable({ data, additionalColumns, tableProperties }) {
  const columns = [
    {
      key: 'title',
      title: 'Titulo',
      dataIndex: 'title',
      render: (value, record) => (
        <Link
          to={{ pathname: `/app/event`, state: { render: '3', id: record.id, nameId: 'details' } }}
        >
          {record.title}
        </Link>
      ),
    },
    {
      key: 'content',
      title: 'Tipo',
      render: record => record.content,
    },
    {
      key: 'comment',
      title: 'Comenário',
      render: record => record.comment,
    },
    {
      key: 'startAt',
      title: 'Começa as',
      render: record => record.startAt,
    },
    {
      key: 'endAt',
      title: 'Terminas as',
      render: record => record.endAt,
    },
    ...additionalColumns,
  ]

  return (
    <Table
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...tableProperties}
      pagination={false}
      size="small"
      columns={columns}
      dataSource={data}
    />
  )
}

TeamTable.propTypes = {
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    })
  ).isRequired,
  onTimesChange: PropTypes.func,
  filteredColumns: arrayOf(PropTypes.string),
  additionalColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.any,
    })
  ),
  tableProperties: PropTypes.shape(),
}

TeamTable.defaultProps = {
  onTimesChange: null,
  filteredColumns: [],
  additionalColumns: [],
  tableProperties: null,
}

export default TeamTable
