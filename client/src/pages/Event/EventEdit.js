import React, { Component } from 'react'
import { Typography, Card, message, Skeleton } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import * as eventStore from '../../store/ducks/event'
import * as teamStore from '../../store/ducks/team'
import * as teamListStore from '../../store/ducks/teamList'
import EditEventForm from '../../components/events/EditEventForm'

const { Title, Paragraph } = Typography

class EventEdit extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: true }
  }

  componentDidMount = async () => {
    const { fetchEvent, fetchTeamListWithMembers, id } = this.props

    document.title = 'Eventos - Motorman'

    try {
      await fetchEvent(id)
      await fetchTeamListWithMembers()

      const { event } = this.props

      this.setState({
        initialValues: {
          ...event,

          start_date: moment(event.start_date, 'DD/MM/YYYY HH:mm'),
          end_date: moment(event.end_date, 'DD/MM/YYYY HH:mm'),

          logType: event.logType.id,
          selectedUsers: event.users,
          selectedTeams: event.teams.map(team => {
            return team.id
          }),
        },
        loading: false,
      })
    } catch (error) {
      message.error('Ocorreu um erro ao recuperar os dados necessários. Tente recarregar a página')
    }
  }

  onSubmit = async data => {
    const { updatedEvent, history, match } = this.props
    const { params } = match
    const { id } = params
    const key = 'loadingMessage'

    try {
      message.loading({ content: 'Aguarde...', key, duration: 0 })
      await updatedEvent({ ...data, id })

      message.success({ content: 'Evento atualizado com sucesso', key })

      history.push(`/app/event/${id}`)
    } catch (error) {
      message.error({
        content: 'Ocorreu um erro ao tentar criar o evento. Você está conectado à internet?',
        key,
      })
      return false
    }
    return true
  }

  render() {
    const { team, teamList } = this.props
    const { loading, initialValues } = this.state
    if (loading) {
      return (
        <Card>
          <Skeleton active avatar paragraph={3} />
        </Card>
      )
    }
    return (
      <Card>
        <Title>Eventos</Title>
        <Paragraph>Cadastrar um novo evento</Paragraph>
        <EditEventForm
          initialValues={initialValues}
          teams={team !== null ? [team] : teamList}
          onSubmit={this.onSubmit}
        />
      </Card>
    )
  }
}

EventEdit.defaultProps = {
  team: null,
  teamList: [],
  event: null,
}

EventEdit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  fetchEvent: PropTypes.func.isRequired,
  updatedEvent: PropTypes.func.isRequired,
  fetchTeamListWithMembers: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  event: PropTypes.shape({
    id: PropTypes.number,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    logType: PropTypes.shape({
      id: PropTypes.number,
    }),
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
      })
    ),
    teams: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
      })
    ),
  }),
  team: PropTypes.shape({
    id: PropTypes.number,
    members: PropTypes.array,
  }),
  teamList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      members: PropTypes.array,
    })
  ),
}

const mapDispatchToProps = {
  fetchEvent: eventStore.fetchEvent,
  updatedEvent: eventStore.updatedEvent,
  fetchTeam: teamStore.fetchTeam,
  fetchTeamListWithMembers: teamListStore.fetchTeamListWithMembers,
}

const mapStateToProps = state => ({
  event: state.event,
  team: state.team,
  teamList: state.teamList,
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EventEdit))
