import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Row, List, message, Select, Typography } from 'antd'

import AddMemberListItem from './AddMemberListItem'
import UserSearchInput from '../user/UserSearchInput'

const { Paragraph, Text, Title } = Typography

class AddMemberSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: [],
      results: [],
    }
  }

  componentDidMount = () => {}

  userSelected = user => {
    const { selected } = this.state
    if (selected.find(u => u.id === user.id)) {
      message.info('Membro já selecionado')
      return
    }
    this.setState({ selected: [...selected, user] }, this.triggerChange)
  }

  userRemoved = user => {
    const { selected } = this.state
    const list = [...selected]
    const index = list.findIndex(u => u.id === user.id)
    list.splice(index, 1)
    this.setState({ selected: list }, this.triggerChange)
  }

  changeRole = (userId, groupId) => {
    const { selected } = this.state
    const list = [...selected]
    const index = list.findIndex(u => u.id === userId)
    const user = list[index]
    const update = { ...user, groupId }
    list.splice(index, 1, update)
    this.setState({ selected: list }, this.triggerChange)
  }

  triggerChange = () => {
    const { selected } = this.state
    const { onChange } = this.props
    onChange(selected)
  }

  render() {
    const { teamRoles } = this.props
    const { selected, results } = this.state
    return (
      <Row gutter={24}>
        <Col xs={24} md={12} style={{ borderRight: '1px solid #f0f0f0' }}>
          <Title level={4}>Selecionar membros</Title>
          <Paragraph>Pesquise membros pelo nome para adicioná-los à equipe:</Paragraph>
          <UserSearchInput onResult={users => this.setState({ results: users })} />
          <List
            dataSource={results}
            renderItem={user => (
              <AddMemberListItem
                user={user}
                actionText="adicionar"
                onActionClick={() => this.userSelected(user)}
                content={
                  <div className="text-right">
                    {user.roles.map(r => (
                      <div key={r.id}>
                        <Text strong>{r.role.title} </Text>
                        na equipe
                        <Text strong> {r.team.name}</Text>
                      </div>
                    ))}
                  </div>
                }
              />
            )}
          />
        </Col>
        <Col xs={24} md={12}>
          <Title level={4}>Membros selecionados</Title>
          <Paragraph>Selecione a função de cada membro na equipe antes de continuar.</Paragraph>
          <List
            dataSource={selected}
            renderItem={user => (
              <AddMemberListItem
                danger
                user={user}
                actionText="remover"
                content={
                  <div>
                    <Text>Função: </Text>
                    <Select
                      style={{ width: 160 }}
                      onChange={option => this.changeRole(user.id, option)}
                    >
                      {teamRoles.map(group => (
                        <Select.Option key={group.id} value={group.id}>
                          {group.title}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                }
                onActionClick={() => this.userRemoved(user)}
              />
            )}
          />
        </Col>
      </Row>
    )
  }
}

AddMemberSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  teamRoles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
}

export default AddMemberSelector
