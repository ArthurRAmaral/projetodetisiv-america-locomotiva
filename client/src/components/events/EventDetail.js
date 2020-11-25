import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Typography, Card } from 'antd'
import PropTypes from 'prop-types'
import * as EventStore from '../../store/ducks/event'
import TeamTable from '../times/TeamTable'
import RemoveEventButton from './RemoveEventButton'
import EditEventButton from './EditEventButton'
import EventPresenceCheck from '../../pages/Event/EventPresenceCheck'

const { Text, Paragraph, Title } = Typography
const DetailField = ({ label, value }) => (
  <>
    <Col xs={12} md={8}>
      <Text type="secondary">{label}</Text>
    </Col>
    <Col xs={12} md={16}>
      <Paragraph>{value}</Paragraph>
    </Col>
  </>
)
DetailField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
}
DetailField.defaultProps = {
  value: null,
}

class EventDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
    }
  }

  componentDidMount = () => {
    const { event } = this.props

    const users = event.users.map(user => ({
      ...user,
      key: user.id,
      presence: !user.pivot.presence ? 'Ausente' : 'Presente',
    }))

    this.setState({
      users,
    })
  }

  render() {
    const { loading, event } = this.props
    const { users } = this.state
    const { teams } = event

    return (
      <>
        <Row className="mb-lg">
          <Col xs={24} md={12}>
            <Title level={3}>Detalhes do evento</Title>
          </Col>
          <Col xs={24} md={12}>
            <Row justify="end">
              <RemoveEventButton event={event} />
              <EditEventButton id={event.id} />
            </Row>
          </Col>
        </Row>

        <Row className="mb-lg">
          <Col xs={24} />
        </Row>
        <Row>
          <Col xs={24} sm={12}>
            <Row className="mb-lg">
              <DetailField label="Categoria:" value={event.logType.name} />
              <DetailField label="Nome:" value={event.name} />
              <DetailField label="Data de inicio:" value={event.start_date} />
              <DetailField label="Data de encerramento:" value={event.end_date} />
              <DetailField label="Times convocados:" value={teams.length} />
              <DetailField label="Pessoas convocadas:" value={users.length} />
              <DetailField label="Observações:" value={event.comments} />
            </Row>
          </Col>

          <Col xs={24} sm={12}>
            <Title level={4}>Times Participantes</Title>
            <Card style={{ height: '80%', borderRadius: '20px' }}>
              <TeamTable
                tableProperties={{
                  pagination: { hideOnSinglePage: true },
                  scroll: { y: 200, x: 430 },
                }}
                teams={teams}
                loading={loading}
                filteredColumns={['options', 'created_at']}
              />
            </Card>
          </Col>

          <Col xs={24}>
            <Title level={4}>Usuários participantes</Title>
            <EventPresenceCheck />
          </Col>
        </Row>
      </>
    )
  }
}

EventDetail.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    comments: PropTypes.string,
    logType: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    teams: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
      })
    ),
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
      })
    ),
  }).isRequired,
  loading: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  event: state.event,
})
const mapDispatchToProps = {
  fetchEvent: EventStore.fetchEvent,
}
export default connect(mapStateToProps, mapDispatchToProps)(EventDetail)
