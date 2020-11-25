import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import StatusTag from '../StatusTag'
import MoneyMask from '../masked/MoneyMask'
import TogglePlanStatusButton from './TogglePlanStatusButton'

function PlansTable({ plans, onDeleteClick, onRestoreClick, onEditClick }) {
  return (
    <Table rowKey="id" dataSource={plans}>
      <Table.Column
        title="Nome do plano"
        dataIndex="name"
        render={(value, record) => <Link to={`/app/plan/${record.id}`}>{value}</Link>}
      />

      <Table.Column
        title="Valor mensal"
        dataIndex="monthlyPrice"
        render={value => <MoneyMask value={value} />}
      />

      <Table.Column
        title="Status"
        dataIndex="active"
        render={(value, record) => <StatusTag entity={record} />}
      />

      <Table.Column
        title="Opções"
        render={record => (
          <div>
            <Button
              size="small"
              type="link"
              className="mr-sm"
              icon={<EditOutlined />}
              onClick={() => onEditClick(record)}
            >
              Editar
            </Button>
            <TogglePlanStatusButton
              plan={record}
              onDeleteClick={onDeleteClick}
              onRestoreClick={onRestoreClick}
            />
          </div>
        )}
      />
    </Table>
  )
}

PlansTable.propTypes = {
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    })
  ).isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onRestoreClick: PropTypes.func.isRequired,
}

export default PlansTable
