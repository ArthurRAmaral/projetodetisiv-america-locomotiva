import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Table, Tooltip, Dropdown, Menu, Button, Tag } from 'antd'

import Column from 'antd/lib/table/Column'
import { ToolOutlined, WhatsAppOutlined } from '@ant-design/icons'
import UserAvatar from './UserAvatar'
import StatusTag from '../StatusTag'
import { formatPhoneNumber, formatDateTime } from '../../util/stringUtil'

import EditUserButton from './EditUserButton'
import RemoveUserButton from './RemoveUserButton'
import RestoreUserButton from './RestoreUserButton'

import TabContext from '../../pages/User/UserContext'

function UserFilteredTable({
  loading,
  pagination,
  users,
  onUserChange,
  onChange,
  sortInfo,
  footer,
}) {
  const { field, order } = sortInfo

  const addTab = useContext(TabContext)

  return (
    <Table
      scroll={{ x: 'auto' }}
      rowKey="id"
      pagination={{ ...pagination, hideOnSinglePage: true }}
      size="small"
      loading={loading}
      dataSource={users}
      onChange={onChange}
      footer={footer}
    >
      <Column dataIndex="id" title="#" sorter sortDirections={field === 'id' && order} />

      <Column
        title=""
        dataIndex="avatar"
        render={(value, record) => (
          <Tooltip title="Ver detalhes">
            <Link to={`/app/user/${record.id}`} onClick={() => addTab('3', record.id, 'details')}>
              <UserAvatar user={record} />
            </Link>
          </Tooltip>
        )}
      />

      <Column
        title="Apelido"
        dataIndex="nickname"
        sorter
        sortDirections={field === 'nickname' && order}
        render={(value, record) => (
          <Link to={`/app/user/${record.id}`} onClick={() => addTab('3', record.id, 'details')}>
            {record.nickname}
          </Link>
        )}
      />

      <Column
        title="Time(s)"
        render={record =>
          record.teams && record.teams.map(team => <div key={team.id}>{team.name}</div>)
        }
      />

      <Column
        title="Nome Completo"
        dataIndex="fullName"
        sorter
        sortDirections={field === 'fullName' && order}
      />
      <Column title="E-mail" dataIndex="email" sorter sortDirections={field === 'email' && order} />

      <Column
        title="Telefone"
        dataIndex="phone"
        sorter
        sortDirections={field === 'phone' && order}
        render={value =>
          value && (
            <div>
              <a
                href={`https://web.whatsapp.com/send?phone=55${value}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppOutlined />
              </a>
              &nbsp;
              {formatPhoneNumber(value)}
            </div>
          )
        }
      />

      <Column
        title="Data Cadastro"
        dataIndex="created_at"
        sorter
        sortDirections={field === 'created_at' && order}
        render={formatDateTime}
      />

      <Column
        title="Tipo"
        dataIndex="group_id"
        sorter
        sortDirections={field === 'group_id' && order}
        render={(value, record) => record.group && <Tag>{record.group.title}</Tag>}
      />

      <Column
        title="Status"
        dataIndex="active"
        sorter
        sortDirections={field === 'active' && order}
        render={(value, record) => <StatusTag entity={record} />}
      />
      <Column
        title="Plano"
        dataIndex="plan_id"
        sorter
        sortDirections={field === 'plan_id' && order}
        render={(value, record) => <div>{record.plan && record.plan.name}</div>}
      />
      <Column
        title="Opções"
        render={(value, record) => (
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
        )}
      />
    </Table>
  )
}

UserFilteredTable.propTypes = {
  pagination: PropTypes.shape({
    current: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    })
  ).isRequired,
  sortInfo: PropTypes.shape({
    field: PropTypes.string,
    order: PropTypes.string,
  }).isRequired,
  onUserChange: PropTypes.func,
  footer: PropTypes.elementType,
}

UserFilteredTable.defaultProps = {
  onUserChange: null,
  footer: null,
}

export default UserFilteredTable
