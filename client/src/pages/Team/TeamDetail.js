import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Skeleton, Card, message, Row, Col, Typography, Radio } from 'antd'
import QueryString from 'query-string'
import * as teamStore from '../../store/ducks/team'
import * as teamRolesStore from '../../store/ducks/teamRoles'
import NotFound from '../NotFound'
import AddMemberModal from '../../components/times/AddMemberModal'
import RemoveTeamButton from '../../components/times/RemoveTeamButton'
import EditTeamButton from '../../components/times/EditTeamButton'
import TeamMemberList from '../../components/times/TeamMemberList'
import * as eventsListStore from '../../store/ducks/eventsList'
import EventTable from '../../components/events/EventTable'
import AddEventButton from '../../components/times/AddEventButton'

const { Title, Paragraph } = Typography

class TeamDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      visualization: '',
      loadingEvents: true,
    }
  }

  componentDidMount = async () => {
    const { id, fetchTeam, fetchTeamRoles, location } = this.props
    let { visualization } = QueryString.parse(location.search)
    document.title = 'Times - Motorman'

    try {
      await fetchTeam(id)
      await fetchTeamRoles(id)
      if (visualization === 'events') await this.loadEvents()
      else visualization = 'members'
    } catch (error) {
      message.error('Ocorreu um erro de conexão ao tentar buscar os dados do time.')
    }

    this.setState({ loading: false, visualization })
  }

  loadEvents = async () => {
    const { team, fetchTeamEvent } = this.props

    try {
      await fetchTeamEvent(team.id)
      this.setState({ loadingEvents: false })
    } catch (error) {
      message.error('Erro ao buscar os eventos. Tente recarregar a página.')
    }
  }

  handleAddMembers = async selected => {
    const { addMembers } = this.props

    try {
      await addMembers(selected)
    } catch (error) {
      message.error('Ocorreu um erro ao tentar adicionar os membros ao time.')
      return false
    }

    return true
  }

  changeVisualization = async value => {
    this.setState({ visualization: value.target.value })

    if (value.target.value === 'events') await this.loadEvents()
  }

  render() {
    const { team, teamRoles } = this.props
    const { loading, visualization, loadingEvents } = this.state

    if (loading) {
      return (
        <Card>
          <Skeleton active avatar paragraph={3} />
        </Card>
      )
    }

    if (team) {
      return (
        <Card
          cover={
            <img alt="Team cover" style={{ height: 180, objectFit: 'cover' }} src={team.imageUrl} />
          }
        >
          <Row className="mb-lg">
            <Col xs={24} md={12}>
              <Title level={2}>{team.name}</Title>
              <Paragraph>{team.description}</Paragraph>
            </Col>
            <Col xs={24} md={12}>
              <Row justify="end">
                <RemoveTeamButton team={team} />
                <EditTeamButton id={team.id} />
                <Radio.Group
                  onChange={this.changeVisualization}
                  defaultValue={visualization}
                  buttonStyle="outline"
                  style={{ marginBottom: '3px' }}
                >
                  <Radio.Button value="members">Membros</Radio.Button>
                  <Radio.Button value="events">Eventos</Radio.Button>
                </Radio.Group>
              </Row>
              <Row justify="end">
                {visualization === 'members' && (
                  <AddMemberModal team={team} teamRoles={teamRoles} onOk={this.handleAddMembers} />
                )}
                {visualization === 'events' && <AddEventButton id={team.id} />}
              </Row>
            </Col>
          </Row>
          <Row className="mb-lg">
            {visualization === 'members' && (
              <Col xs={24}>
                <TeamMemberList team={team} />
              </Col>
            )}

            {visualization === 'events' && (
              <Col xs={24}>
                <EventTable loading={loadingEvents} />
              </Col>
            )}
          </Row>
        </Card>
      )
    }

    return <NotFound />
  }
}

TeamDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  fetchTeam: PropTypes.func.isRequired,
  addMembers: PropTypes.func.isRequired,
  team: PropTypes.shape({
    id: PropTypes.number,
    imageUrl: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }),
  teamRoles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  fetchTeamRoles: PropTypes.func.isRequired,
  fetchTeamEvent: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
}

TeamDetail.defaultProps = {
  team: null,
  location: 'dd',
}

const mapDispatchToProps = {
  fetchTeam: teamStore.fetchTeam,
  addMembers: teamStore.addMembers,
  deleteMember: teamStore.deleteMember,
  fetchTeamRoles: teamRolesStore.fetchTeamRoles,
  fetchTeamEvent: eventsListStore.fetchTeamEvent,
}

const mapStateToProps = state => ({
  team: state.team,
  teamRoles: state.teamRoles,
  even: state.eventsList,
})

const TeamDetailContainer = connect(mapStateToProps, mapDispatchToProps)(withRouter(TeamDetail))

export default TeamDetailContainer
