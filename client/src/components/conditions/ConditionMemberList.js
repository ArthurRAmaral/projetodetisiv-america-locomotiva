import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Table, Typography, Tooltip } from 'antd'
import { Link } from 'react-router-dom'

import Column from 'antd/lib/table/Column'

import UserAvatar from '../user/UserAvatar'

const { Text, Title } = Typography

function ConditionMemberList({ condition }) {
  return (
    <Row gutter={16} justify="center" className="mb-sm">
      <Col xs={24} md={12}>
        <Title level={4} color={condition}>
          Usuários com essa condição
          <Text type="secondary"> ({condition.users.length})</Text>
        </Title>

        <Table bordered size="small" rowKey="id" dataSource={condition.users}>
          <Column
            title=""
            dataIndex="avatar"
            render={(value, record) => (
              <Tooltip title="Ver detalhes">
                <Link
                  to={{
                    pathname: `/app/user`,
                    state: { render: '3', id: record.id, nameId: 'details' },
                  }}
                >
                  <UserAvatar user={record} />
                </Link>
              </Tooltip>
            )}
          />
          <Column title="Nome" dataIndex="fullName" />
          <Column title="Apelido" dataIndex="nickname" />
          <Column title="email" dataIndex="email" />
        </Table>
      </Col>
    </Row>
  )
}

ConditionMemberList.propTypes = {
  condition: PropTypes.shape({
    users: PropTypes.arrayOf(
      PropTypes.shape({
        role: PropTypes.shape({
          name: PropTypes.string,
        }),
      })
    ),
  }).isRequired,
}

export default ConditionMemberList
