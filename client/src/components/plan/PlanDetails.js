import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row, Typography, Card, Table } from 'antd'
import Column from 'antd/lib/table/Column'
import { Link } from 'react-router-dom'

import MoneyMask from '../masked/MoneyMask'
import DateTimeMask from '../masked/DateTimeMask'
import StatusTag from '../StatusTag'
import PaymentTable from '../payment/PaymentTable'

const { Text, Title } = Typography

function PlanDetails({ plan, payments }) {
  const sortedUsers = plan.users.sort((a, b) => {
    if (a.fullName > b.fullName) {
      return 1
    }
    if (a.fullName < b.fullName) {
      return -1
    }
    return 0
  })

  return (
    <Row>
      <Col xs={24} md={12}>
        <div className="mb-lg">
          <Title level={4}>{plan.name}</Title>
          <Text type="secondary">Plano de pagamento</Text>
        </div>

        <div className="mb-lg">
          <Title level={4}>Detalhes do plano:</Title>
          <Text type="secondary">Valor mensal: </Text>
          <Text>
            <MoneyMask value={plan.monthlyPrice} />
          </Text>
          <br />

          <Text type="secondary">Data de cadastro: </Text>
          <Text>
            <DateTimeMask value={plan.created_at} />
          </Text>
          <br />

          <Text type="secondary">Status: </Text>
          <Text>
            <StatusTag entity={plan} />
          </Text>
        </div>
      </Col>

      <Col xs={24} md={12}>
        <Title level={4}> Usuários inseridos no plano </Title>
        <Card style={{ height: '80%', borderRadius: '20px' }}>
          <Table
            size="small"
            dataSource={sortedUsers}
            scroll={{ y: 200, x: 430 }}
            pagination={{ hideOnSinglePage: true }}
          >
            <Column
              title="Nome"
              dataIndex="Name"
              render={(value, record) => (
                <Link
                  to={{
                    pathname: `/app/user/`,
                    state: { render: '3', id: record.id, nameId: 'details' },
                  }}
                >
                  {record.fullName}
                </Link>
              )}
            />

            <Column
              title="Email"
              dataIndex="email"
              render={(value, record) => <p>{record.email}</p>}
            />
          </Table>
        </Card>
      </Col>

      <Col xs={24}>
        <Title level={4}> Pagamentos </Title>
        <PaymentTable payments={payments} />
      </Col>
    </Row>
  )
}

PlanDetails.propTypes = {
  plan: PropTypes.shape({
    name: PropTypes.string,
    monthlyPrice: PropTypes.number,
    created_at: PropTypes.string,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        fullName: PropTypes.string,
        avatar: PropTypes.string,
      })
    ),
  }).isRequired,
}

export default PlanDetails
