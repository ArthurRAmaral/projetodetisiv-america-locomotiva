import React, { Component } from 'react'
import { Button, Row, Col } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import UsersTable from '../user/UsersTable'

class PresenceCheckTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
    }
  }

  componentDidMount = () => {
    const { event } = this.props
    const users = event.users.map(user => ({ ...user, key: user.id }))
    this.setUsersState(users)
    this.setState({
      users,
    })
  }

  setUsersState = users => {
    const { setUsersState } = this.props
    setUsersState(users.map(user => ({ id: user.id, presence: user.pivot.presence })))
  }

  setPresence = key => {
    const { users } = this.state

    const user = users.find(u => u.key === key)
    user.pivot.presence = true

    this.setUsersState(users)
    this.setState({ users })
  }

  setAbsence = key => {
    const { users } = this.state

    const user = users.find(u => u.key === key)
    user.pivot.presence = false

    this.setUsersState(users)
    this.setState({ users })
  }

  render() {
    const { loading } = this.props
    const { users } = this.state

    return (
      <UsersTable
        tableProperties={{
          pagination: { hideOnSinglePage: true, pageSize: 100 },
          scroll: { x: 650 },
        }}
        users={users}
        loading={loading}
        filteredColumns={['options', 'created_at', 'plan']}
        onUserChange={null}
        additionalColumns={[
          {
            width: 100,
            title: 'Participação',
            render: (value, record) => {
              return (
                <>
                  <Row>
                    <Col xs={12}>
                      <Button
                        type={record.pivot.presence ? 'primary' : 'dashed'}
                        shape="circle"
                        onClick={() => this.setPresence(record.key)}
                      >
                        <CheckOutlined />
                      </Button>
                    </Col>
                    <Col xs={12}>
                      <Button
                        danger
                        type={!record.pivot.presence ? 'primary' : 'dashed'}
                        shape="circle"
                        onClick={() => this.setAbsence(record.key)}
                      >
                        <CloseOutlined />
                      </Button>
                    </Col>
                  </Row>
                </>
              )
            },
          },
        ]}
      />
    )
  }
}

PresenceCheckTable.defaultProps = {
  setUsersState: null,
}

PresenceCheckTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  event: PropTypes.shape({
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        pivot: PropTypes.shape({
          presence: PropTypes.bool,
        }),
      })
    ),
  }).isRequired,
  setUsersState: PropTypes.func,
}

export default PresenceCheckTable
