import React, { useContext } from 'react'
import PropTypes, { arrayOf } from 'prop-types'
import { Link } from 'react-router-dom'
import { Table, Tooltip, Dropdown, Menu, Button } from 'antd'

import { ToolOutlined } from '@ant-design/icons'
import TeamAvatar from './TeamAvatar'

import EditTeamButton from './EditTeamButton'
import RemoveTeamButton from './RemoveTeamButton'
import RestoreTeamButton from './RestoreTeamButton'
import StatusTag from '../StatusTag'
import DateTimeMask from '../masked/DateTimeMask'

import TabContext from '../../pages/Team/TeamContext'

const renderTag = (value, record) => <StatusTag entity={record} />

const filterColumns = (columns, filteredColumns) => {
  return columns.filter(column => !filteredColumns.includes(column.key))
}

function TeamTable({
  loading,
  teams,
  onTimesChange,
  filteredColumns,
  additionalColumns,
  tableProperties,
}) {
  const addTab = useContext(TabContext)

  const columns = [
    {
      key: 'avatar',
      title: '',
      dataIndex: 'avatar',
      fixed: 'left',
      width: 50,
      render: (value, record) => (
        <Tooltip title="Ver detalhes">
          <Link onClick={() => addTab('3', record.id, 'details')} to={`/app/team/${record.id}`}>
            <TeamAvatar team={record} />
          </Link>
        </Tooltip>
      ),
    },
    {
      key: 'name',
      title: 'Nome',
      dataIndex: 'name',
      fixed: 'left',
      render: (value, record) =>
        addTab ? (
          <Link onClick={() => addTab('3', record.id, 'details')} to="/app/team">
            {record.name}
          </Link>
        ) : (
          <Link
            to={{ pathname: `/app/team`, state: { render: '3', id: record.id, nameId: 'details' } }}
          >
            {record.name}
          </Link>
        ),
    },
    {
      key: 'members',
      title: 'Membros ativos',
      render: record => record.members.length,
    },
    {
      key: 'players',
      title: 'Jogadores',
      render: record => record.members.filter(m => m.role.name === 'player').length,
    },
    {
      key: 'created_at',
      title: 'Data cadastro',
      dataIndex: 'created_at',
      render: value => <DateTimeMask value={value} />,
    },
    {
      key: 'active',
      title: 'Status',
      dataIndex: 'active',
      render: renderTag,
    },
    {
      key: 'options',
      title: '',
      render: (value, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>
                <EditTeamButton id={record.id} />
              </Menu.Item>
              <Menu.Item>
                {React.createElement(record.active ? RemoveTeamButton : RestoreTeamButton, {
                  team: record,
                  onTimesChange,
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
      dataSource={teams.map(u => ({ ...u, key: u.id }))}
    />
  )
}

TeamTable.propTypes = {
  loading: PropTypes.bool.isRequired,
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
