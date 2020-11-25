import React from 'react'
import PropTypes, { arrayOf } from 'prop-types'
import { Link } from 'react-router-dom'
import { Table, Tooltip, Dropdown, Menu, Button } from 'antd'

import { ToolOutlined } from '@ant-design/icons'
import UserAvatar from './UserAvatar'
import StatusTag from '../StatusTag'
import { formatPhoneNumber, formatDateTime } from '../../util/stringUtil'

import EditUserButton from './EditUserButton'
import RemoveUserButton from './RemoveUserButton'
import RestoreUserButton from './RestoreUserButton'

const renderAvatar = (value, record) => (
  <Tooltip title="Ver detalhes">
    <Link to={`/app/user/${record.id}`}>
      <UserAvatar user={record} />
    </Link>
  </Tooltip>
)

const renderTag = (value, record) => <StatusTag entity={record} />

const filterColumns = (columns, filteredColumns) => {
  return columns.filter(column => !filteredColumns.includes(column.key))
}

function UsersTable({
  loading,
  users,
  onUserChange,
  filteredColumns,
  additionalColumns,
  tableProperties,
}) {
  const columns = [
    {
      key: 'avatar',
      title: '',
      dataIndex: 'avatar',
      fixed: 'left',
      width: 50,
      render: renderAvatar,
    },
    {
      key: 'nickname',
      title: 'Apelido',
      dataIndex: 'nickname',
      fixed: 'left',
      render: (value, record) => (
        <Link
          to={{ pathname: `/app/user`, state: { render: '3', id: record.id, nameId: 'details' } }}
        >
          {record.nickname}
        </Link>
      ),
    },
    {
      key: 'teams',
      title: 'Time(s)',
      render: record => record.teams.map(team => <div key={team.id}>{team.name}</div>),
    },
    {
      key: 'fullName',
      title: 'Nome',
      dataIndex: 'fullName',
    },
    {
      key: 'email',
      title: 'E-mail',
      dataIndex: 'email',
    },
    {
      key: 'phone',
      title: 'Telefone',
      dataIndex: 'phone',
      render: formatPhoneNumber,
    },
    {
      key: 'created_at',
      title: 'Data Cadastro',
      dataIndex: 'created_at',
      render: formatDateTime,
    },
    {
      key: 'active',
      title: 'Status',
      dataIndex: 'active',
      render: renderTag,
      width: 60,
    },
    {
      key: 'plan',
      title: 'Plano',
      render: record => <div>{record.plan && record.plan.name}</div>,
    },
    {
      key: 'options',
      title: 'Opções',
      render: (value, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>
                <EditUserButton id={record.id} />
              </Menu.Item>
              <Menu.Item>
                {React.createElement(record.active ? RemoveUserButton : RestoreUserButton, {
                  user: record,
                  onUserChange,
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
      dataSource={loading ? [] : users.map(u => ({ ...u, key: u.id }))}
    />
  )
}

const userProps = PropTypes.shape({
  id: PropTypes.number,
})

UsersTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  users: PropTypes.arrayOf(userProps).isRequired,
  onUserChange: PropTypes.func,
  filteredColumns: arrayOf(PropTypes.string),
  additionalColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.any,
    })
  ),
  tableProperties: PropTypes.shape(),
}

UsersTable.defaultProps = {
  onUserChange: null,
  filteredColumns: [],
  additionalColumns: [],
  tableProperties: null,
}

export default UsersTable
