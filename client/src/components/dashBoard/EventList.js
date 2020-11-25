import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { message, List, Badge, Card, Typography } from 'antd'
import * as EventsListStore from '../../store/ducks/eventsList'

const EventList = ({ eventsList, fetchEvents }) => {
  const [listData, setListData] = useState()

  const SUCCESS = 'success'

  const hasEventList = () => eventsList.length > 0

  useEffect(() => {
    document.title = 'Home - Motorman'

    async function fetchData() {
      try {
        await fetchEvents()
      } catch (error) {
        message.error('Erro ao buscar os eventos. Tente recarregar a página.')
      }
    }

    if (!hasEventList()) {
      fetchData()
    }

    if (!listData && hasEventList()) {
      createListData()
    }
  })

  const createListData = () => {
    const nextEvents = eventsList.filter(event => {
      const dateNow = moment(new Date())

      const dateEnd = moment(new Date(event.start_date))

      const isNextEvents = dateEnd.diff(dateNow, 'days') >= 0

      return isNextEvents
    })

    const listLocalData = nextEvents.map(event => {
      const dataListEvents = {
        date: new Date(event.start_date).toLocaleDateString(),
        type: SUCCESS,
        content: event.logType.name
      }

      return dataListEvents
    })

    const listLocalDataSorted = listLocalData.sort((a, b) => {
      return new Date(a.date) - new Date(b.date)
    })

    setListData([...listLocalDataSorted])
  }

  return (
    <Card title="Próximos eventos" style={{ width: 300, marginBottom: 30 }}>
      {eventsList.length ? (
        <List>
          {listData &&
            listData.map(data => (
              <List.Item key={data.date}>
                <Badge
                  status={data.type}
                  text={`${data.content} - ${data.date}`}
                />
              </List.Item>
            ))}
        </List>
      ) : (
          <Typography.Text strong> Não há eventos marcados </Typography.Text>
        )}
    </Card>
  )
}

const mapStateToProps = state => ({
  eventsList: state.eventsList
})

const mapDispatchToProps = {
  fetchEvents: EventsListStore.fetchEvents
}

export default connect(mapStateToProps, mapDispatchToProps)(EventList)
