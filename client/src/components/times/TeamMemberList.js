import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Table, Dropdown, Menu, Button, Typography } from 'antd'
import Column from 'antd/lib/table/Column'
import { ToolOutlined } from '@ant-design/icons'
import RemoveUserTeamButton from './RemoveUserTeamButton'

const { Text, Title } = Typography

function TeamMemberList({ team }) {
  const coaches = team.members
    .filter(member => member.role.name === 'coach')
    .map(member => member.user)

  const players = team.members
    .filter(member => member.role.name === 'player')
    .map(member => member.user)

  const assistants = team.members
    .filter(member => member.role.name === 'assistant')
    .map(member => member.user)

  return (
    <Row gutter={16} justify="center" className="mb-sm">
      <Col xs={24} md={12}>
        <Title level={4}>
          Treinadores
          <Text type="secondary"> ({coaches.length})</Text>
        </Title>
        <Table bordered size="small" rowKey="id" dataSource={coaches}>
          <Column title="Nome" dataIndex="fullName" />
          <Column title="Apelido" dataIndex="nickname" />
          <Column
            title=""
            render={(value, record) => (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <RemoveUserTeamButton user={record} />
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
      </Col>
      <Col xs={24} md={12}>
        <Title level={4}>
          Auxiliares
          <Text type="secondary"> ({assistants.length})</Text>
        </Title>
        <Table bordered size="small" rowKey="id" dataSource={assistants}>
          <Column title="Nome" dataIndex="fullName" />
          <Column title="Apelido" dataIndex="nickname" />
          <Column
            title=""
            render={(value, record) => (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <RemoveUserTeamButton user={record} />
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
      </Col>
      <Col xs={24} md={24}>
        <Title level={4}>
          Jogadores
          <Text type="secondary"> ({players.length})</Text>
        </Title>
        <Table bordered size="small" rowKey="id" dataSource={players}>
          <Column title="Nome" dataIndex="fullName" />
          <Column title="Apelido" dataIndex="nickname" />
          <Column
            title=""
            render={(value, record) => (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <RemoveUserTeamButton user={record} />
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
      </Col>
    </Row>
  )
}

TeamMemberList.propTypes = {
  team: PropTypes.shape({
    members: PropTypes.arrayOf(
      PropTypes.shape({
        role: PropTypes.shape({
          name: PropTypes.string,
        }),
      })
    ),
  }).isRequired,
}

export default TeamMemberList
