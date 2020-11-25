import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { message, Skeleton, Button, Row, Col, Card } from 'antd'
import PropTypes from 'prop-types'
import PresenceCheckTable from '../../components/events/PresenceCheckTable'
import * as EventStore from '../../store/ducks/event'
import NotFound from '../NotFound'
import Api from '../../services/api'

class EventPresenceCheck extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      usersState: [],
    }
  }

  componentDidMount = async () => {
    const { match, fetchEvent } = this.props
    const { params } = match
    const { id } = params
    document.title = 'Eventos - Motorman'

    try {
      await fetchEvent(id)
    } catch (error) {
      message.error('Ocorreu um erro ao buscar os detalhes do evento. Tente recarregar a página.')
    }
    this.setState({ loading: false })
  }

  getUsersState = usersState => this.setState({ usersState })

  onSubmit = async () => {
    const { event } = this.props
    const { usersState } = this.state

    const messageKey = 'messageKey'

    message.loading({ content: 'Aguarde...', key: messageKey, duration: 0 })

    try {
      await Api.put(`/event/check-presence/${event.id}`, { users: usersState })

      message.success({ content: 'Chamada realizada!!', key: messageKey })
    } catch (error) {
      message.error({
        content: 'Ocorreu um erro ao realizar a chamada. Você está conectado à internet?',
        key: messageKey,
      })
    }
  }

  render() {
    const { event } = this.props
    const { loading } = this.state

    if (loading)
      return (
        <Card>
          <Skeleton active avatar paragraph={3} />
        </Card>
      )

    if (event)
      return (
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24}>
            <PresenceCheckTable
              setUsersState={this.getUsersState}
              event={event}
              loading={loading}
            />
          </Col>
          <Col xs={24}>
            <Row justify="end">
              <Button type="primary" style={{ width: 200 }} onClick={this.onSubmit}>
                Salvar
              </Button>
            </Row>
          </Col>
        </Row>
      )

    return <NotFound />
  }
}

EventPresenceCheck.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  event: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
      })
    ),
  }),
  fetchEvent: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
}

EventPresenceCheck.defaultProps = {
  event: null,
}

const mapStateToProps = state => ({
  event: state.event,
})
const mapDispatchToProps = {
  fetchEvent: EventStore.fetchEvent,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withRouter(EventPresenceCheck)))
