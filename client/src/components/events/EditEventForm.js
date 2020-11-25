import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Row,
  Col,
  Form,
  Input,
  Typography,
  AutoComplete,
  Button,
  DatePicker,
  Select,
  message,
} from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import { CloseOutlined, SaveOutlined } from '@ant-design/icons'
import UsersTable from '../user/UsersTable'
import * as logTypeStore from '../../store/ducks/logTypes'

class EditEventForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      optionsSelect: [],

      optionsAutoComplete: [],
      selectedUsers: [],
      valueInputAutoComplete: '',
      valueAutoComplete: '',

      loading: true,
      members: [],
      selectedTeams: [],
    }
  }

  componentDidMount = async () => {
    const { teams, initialValues, fetchLogTypes } = this.props
    const { selectedTeams } = initialValues

    await fetchLogTypes()

    const members = []
    teams.forEach(team => {
      if (selectedTeams.includes(team.id)) {
        team.members.forEach(member => {
          if (!members.some(m => m.user.id === member.user.id)) {
            members.push(member)
          }
        })
      }
    })

    this.setState({
      ...initialValues,
      optionsAutoComplete: this.buildOptionsForAutoComplete(members, []),
      optionsSelect: this.buildOptionsForLogType(),
      loading: false,
      members,
    })
  }

  buildOptionsForLogType = () => {
    const { logTypes } = this.props
    return logTypes.map(logType => ({ value: logType.id, label: logType.name }))
  }

  buildOptionsForAutoComplete = (members, selectedUsers) => {
    const filteredMembers = members.filter(
      member => !selectedUsers.some(su => su.id === member.user.id)
    )
    const roles = new Set()

    filteredMembers.map(member => roles.add(member.role.title))

    return [...roles].map(role => {
      const options = []
      filteredMembers.forEach(member => {
        if (member.role.title === role)
          options.push({
            id: member.user.id,
            value: `${member.user.nickname} (${member.user.fullName})`,
            label: `${member.user.nickname} (${member.user.fullName})`,
          })
      })

      return {
        label: role,
        options,
      }
    })
  }

  selectUser = () => {
    const { members, selectedUsers, valueAutoComplete } = this.state

    const newMember = members.find(member => member.user.id === valueAutoComplete.id)

    if (newMember) {
      const { user } = newMember

      const NewSelectedUsers = [...selectedUsers, { ...user }]

      this.setState({
        selectedUsers: NewSelectedUsers,
        valueAutoComplete: '',
        valueInputAutoComplete: '',
        optionsAutoComplete: this.buildOptionsForAutoComplete(members, NewSelectedUsers),
      })
    } else {
      message.error('Não há membros no time')
    }
  }

  selectAllUsers = () => {
    const { members } = this.state

    const selectedUsers = members.map(member => member.user)

    this.setState({
      selectedUsers,
      valueAutoComplete: '',
      valueInputAutoComplete: '',
      optionsAutoComplete: this.buildOptionsForAutoComplete(members, selectedUsers),
    })
  }

  onSelectUser = (key, opt) => this.setState({ valueAutoComplete: opt })

  onSelectTeam = selectedTeams => {
    const { teams } = this.props

    const members = []
    teams.forEach(team => {
      if (selectedTeams.includes(team.id)) {
        team.members.forEach(member => {
          if (!members.some(m => m.user.id === member.user.id)) {
            members.push(member)
          }
        })
      }
    })

    this.setState({
      members,
      optionsAutoComplete: this.buildOptionsForAutoComplete(members, []),
      selectedTeams,
    })
  }

  onInputKeyDown = key => {
    if (key.keyCode === 13) this.selectUser()
  }

  handleDelete = key => {
    const { members, selectedUsers } = this.state

    const auxSelectedUsers = selectedUsers.filter(selectedUser => selectedUser.id !== key)

    this.setState({
      optionsAutoComplete: this.buildOptionsForAutoComplete(members, auxSelectedUsers),
      selectedUsers: auxSelectedUsers,
    })
  }

  handleDeleteAll = () => {
    const { members } = this.state

    this.setState({
      optionsAutoComplete: this.buildOptionsForAutoComplete(members, []),
      selectedUsers: [],
    })
  }

  handleFinish = value => {
    const { onSubmit } = this.props
    const { selectedUsers, selectedTeams } = this.state

    const users = selectedUsers.map(selectedUser => selectedUser.id)

    const data = {
      ...value,
      start_date: value.start_date.format(),
      end_date: value.end_date ? value.end_date.format() : null,
      users,
      teams: selectedTeams,
    }
    if (users.length < 1) message.error('É necessário selecionar ao menos 1 usuário')
    else onSubmit(data)
  }

  render() {
    const { teams, initialValues } = this.props
    const {
      selectedUsers,
      optionsAutoComplete,
      optionsSelect,
      valueInputAutoComplete,
      loading,
      selectedTeams,
    } = this.state
    return (
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form
            initialValues={initialValues}
            layout="vertical"
            onBlur={this.setEventData}
            onFinish={this.handleFinish}
          >
            <Form.Item
              label="Nome do evento"
              name="name"
              rules={[{ required: true, message: 'Este campo é obrigatório' }]}
            >
              <Input placeholder="Confraternização" />
            </Form.Item>
            <Form.Item
              label="Tipo de evento"
              name="logType"
              rules={[{ required: true, message: 'Este campo é obrigatório' }]}
            >
              <Select options={optionsSelect} loading={loading} />
            </Form.Item>
            <Form.Item
              label="Data de inicio"
              name="start_date"
              rules={[{ required: true, message: 'Este campo é obrigatório' }]}
            >
              <DatePicker
                showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
                style={{ width: '100%' }}
                placeholder="DD/MM/AAAA HH:MM"
                format="DD/MM/YYYY HH:mm"
              />
            </Form.Item>
            <Form.Item label="Data de encerramento" name="end_date">
              <DatePicker
                showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
                style={{ width: '100%' }}
                placeholder="DD/MM/AAAA HH:MM"
                format="DD/MM/YYYY HH:mm"
              />
            </Form.Item>
            <Form.Item label="Observações" name="comments">
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Salvar
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col xs={24}>
          <Typography.Title level={4}>Usuários convocados</Typography.Title>
        </Col>
        <Col xs={24}>
          <Form layout="inline">
            <Form.Item
              style={{
                width: window.innerWidth > 425 ? '31%' : '100%',
                marginRight: 0,
              }}
            >
              <Select
                value={selectedTeams}
                placeholder="Escolha os Times"
                mode="multiple"
                options={teams.map(team => ({ label: team.name, value: team.id }))}
                onChange={this.onSelectTeam}
              />
            </Form.Item>

            <Form.Item
              style={{
                width: window.innerWidth > 425 ? '32%' : '100%',
                marginRight: 0,
              }}
            >
              <AutoComplete
                options={optionsAutoComplete}
                onSelect={this.onSelectUser}
                onChange={value => this.setState({ valueInputAutoComplete: value })}
                value={valueInputAutoComplete}
                loading={loading}
                placeholder="Escolha os usuários"
                filterOption
              >
                <Input.Search onPressEnter={this.selectUser} />
              </AutoComplete>
            </Form.Item>
            <Button
              style={{ width: window.innerWidth <= 425 ? '50%' : '15%' }}
              onClick={this.selectUser}
            >
              Convocar
            </Button>
            <Button
              style={{ width: window.innerWidth <= 425 ? '50%' : '22%' }}
              onClick={this.selectAllUsers}
            >
              Convocar todos
            </Button>
          </Form>
        </Col>
        <Col xs={24}>
          <UsersTable
            tableProperties={{
              scroll: { x: 650 },
            }}
            users={selectedUsers.map(selectedUser => ({
              key: selectedUser.id,
              ...selectedUser,
            }))}
            loading={loading}
            filteredColumns={['options', 'created_at', 'plan', 'teams']}
            onUserChange={null}
            additionalColumns={[
              {
                title: (
                  <Button danger onClick={this.handleDeleteAll}>
                    <CloseOutlined />
                  </Button>
                ),
                render: (value, record) => {
                  return (
                    <Button
                      danger
                      onClick={() => this.handleDelete(record.key, record.id)}
                      type="link"
                    >
                      <CloseOutlined />
                    </Button>
                  )
                },
              },
            ]}
          />
        </Col>
      </Row>
    )
  }
}

EditEventForm.defaultProps = {
  initialValues: { selectedTeams: [] },
}

EditEventForm.propTypes = {
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      members: PropTypes.array,
    })
  ).isRequired,
  logTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    selectedTeams: PropTypes.arrayOf(PropTypes.number),
  }),
  fetchLogTypes: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
  fetchLogTypes: logTypeStore.fetchLogTypes,
}

const mapStateToProps = state => ({
  logTypes: state.logTypes,
})

export default connect(mapStateToProps, mapDispatchToProps)(EditEventForm)
