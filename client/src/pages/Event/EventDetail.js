import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Skeleton, Card, message } from 'antd'
import { withRouter } from 'react-router-dom'
import * as eventStore from '../../store/ducks/event'
import EventDetailCard from '../../components/events/EventDetail'
import NotFound from '../NotFound'

class EventDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }
  }

  componentDidMount = async () => {
    const { id, fetchEvent } = this.props
    document.title = 'Eventos - Motorman'

    try {
      await fetchEvent(id)
      this.setState({ loading: false })
    } catch (error) {
      message.error('Ocorreu um erro ao buscar os detalhes do evento. Tente recarregar a página.')
    }
  }

  render() {
    const { event } = this.props
    const { loading } = this.state

    if (loading) {
      return (
        <Card>
          <Skeleton active avatar paragraph={3} />
        </Card>
      )
    }

    if (event) {
      return <EventDetailCard event={event} loading={loading} />
    }
    return <NotFound />
  }
}

EventDetail.defaultProps = {
  event: null,
}

EventDetail.propTypes = {
  event: PropTypes.shape({
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
  }),
  fetchEvent: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
}

const mapDispatchToProps = {
  fetchEvent: eventStore.fetchEvent,
}

const mapStateToProps = state => ({
  event: state.event,
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EventDetail))
