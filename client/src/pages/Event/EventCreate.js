import React, { Component } from 'react'
import { Typography, Card, message, Skeleton } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as eventStore from '../../store/ducks/event'
import * as teamStore from '../../store/ducks/team'
import * as teamListStore from '../../store/ducks/teamList'
import EditEventForm from '../../components/events/EditEventForm'

const { Title, Paragraph } = Typography

class EventCreate extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: true }
  }

  componentDidMount = async () => {
    const { fetchTeam, fetchTeamListWithMembers, match } = this.props
    const { params } = match
    const { id } = params

    document.title = 'Eventos - Motorman'

    try {
      if (id != null) {
        await fetchTeam(id)
        const { team } = this.props
        this.setState({
          initialValues: {
            selectedTeams: [team.id],
          },
          loading: false,
        })
      } else {
        await fetchTeamListWithMembers()
        this.setState({ loading: false })
      }
    } catch (error) {
      message.error('Ocorreu um erro ao recuperar os dados necessários. Tente recarregar a página')
    }
  }

  onSubmit = async data => {
    const { createTeamEvent, history, match } = this.props
    const { params } = match
    const { id } = params
    const key = 'loadingMessage'

    try {
      message.loading({ content: 'Aguarde...', key, duration: 0 })
      await createTeamEvent(data)

      message.success({ content: 'Evento criado com sucesso', key })

      if (id != null) history.push(`/app/team/${id}?visualization=events`)
      else history.push('/app/event/list')
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
    const { initialValues, loading } = this.state
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

EventCreate.defaultProps = {
  team: null,
  teamList: [],
}

EventCreate.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
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
  fetchTeam: PropTypes.func.isRequired,
  fetchTeamListWithMembers: PropTypes.func.isRequired,
  createTeamEvent: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
}

const mapDispatchToProps = {
  fetchTeam: teamStore.fetchTeam,
  fetchTeamListWithMembers: teamListStore.fetchTeamListWithMembers,
  createTeamEvent: eventStore.createTeamEvent,
}

const mapStateToProps = state => ({
  team: state.team,
  teamList: state.teamList,
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EventCreate))
