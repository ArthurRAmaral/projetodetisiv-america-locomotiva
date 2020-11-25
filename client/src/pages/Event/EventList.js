import React, { Component } from 'react'
import { Card, Typography, message, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as EventsListStore from '../../store/ducks/eventsList'
import EventTable from '../../components/events/EventTable'

import TabContext from './EventContext'

const { Title, Paragraph } = Typography

class EventList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }
  }

  componentDidMount = async () => {
    const { fetchEvents } = this.props
    document.title = 'Eventos - Motorman'

    try {
      await fetchEvents()
      this.setState({ loading: false })
    } catch (error) {
      message.error('Erro ao buscar os eventos. Tente recarregar a página.')
    }
  }

  render() {
    const { loading } = this.state
    return (
      <Card>
        <Title>Eventos</Title>
        <Paragraph>Todos os eventos cadastrados no sistema</Paragraph>

        <div className="mb-lg">
          <TabContext.Consumer>
            {addTab => (
              <Button onClick={() => addTab('2')} path="/app/event/create" icon={<PlusOutlined />}>
                Cadastrar evento
              </Button>
            )}
          </TabContext.Consumer>
        </div>
        <EventTable loading={loading} />
      </Card>
    )
  }
}

EventList.propTypes = {
  fetchEvents: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
  fetchEvents: EventsListStore.fetchEvents,
}

const mapStateToProps = state => ({
  eventsList: state.eventsList,
})

export default connect(mapStateToProps, mapDispatchToProps)(EventList)
