import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import PropTypes from 'prop-types'
import {
  Calendar as CalendarAnt,
  Badge,
  message,
  ConfigProvider,
  Modal
} from 'antd'
import ptBR from 'antd/lib/locale-provider/pt_BR'
import MenuNavigationRouter from '../components/MenuNavigationRouter'
import * as EventsListStore from '../store/ducks/eventsList'
import CelendarTable from '../components/Calendar/CalendarTable'

const Calendar = ({ eventsList, fetchEvents }) => {
  const [listData, setListData] = useState()
  const [visibleModal, setVisibleModal] = useState(false)
  const [date, setDate] = useState(false)

  const badgeTypes = {
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error'
  }

  async function fetchData() {
    if (!hasEventList()) {
      try {
        await fetchEvents()
      } catch (error) {
        message.error('Erro ao buscar os eventos. Tente recarregar a página.')
      }
    }
  }

  const createListData = () => {
    if (hasEventList()) {
      const listLocalData = eventsList.map(event => {
        const dateStart = moment(new Date(event.start_date))
        const dayNumber = dateStart.date()
        const monthNumber = dateStart.month()

        const dateNow = moment(new Date())

        const type =
          dateStart.diff(dateNow, 'days') >= 0 && event.active
            ? badgeTypes.SUCCESS
            : badgeTypes.ERROR

        const startDate = event.start_date.split('T')[1].split(':')
        const startAt = `${startDate[0]}:${startDate[1]}`

        const endDate = event.end_date.split('T')[1].split(':')
        const endAt = `${endDate[0]}:${endDate[1]}`

        const dataEventCalendar = {
          id: event.id,
          day: dayNumber,
          month: monthNumber,
          type,
          title: event.name,
          comment: event.comments,
          content: event.logType.name,
          startAt,
          endAt
        }

        return dataEventCalendar
      })

      setListData([...listLocalData])
    }
  }

  const hasEventList = () => eventsList.length > 0

  const getListData = value => {
    const cellDay = value.date()

    const listCellDay = listData.filter(
      dataEventCalendar => dataEventCalendar.day === cellDay
    )

    return listCellDay
  }

  const dateCellRender = value => {
    const listCellDay = getListData(value)
    return (
      <ul>
        {listCellDay.map(
          item =>
            value.month() === item.month && (
              <li key={item.content} style={{ listStyle: 'none' }}>
                <Badge status={item.type} text={item.content} />
              </li>
            )
        )}
      </ul>
    )
  }

  if (!hasEventList()) {
    fetchData()
  } else if (hasEventList && !listData) {
    createListData()
  }

  useEffect(() => {
    document.title = 'Calendar - Motorman'
  })

  const onSelect = value => {
    setVisibleModal(true)
    setDate(value)
  }

  const handleCloseModal = () => {
    setVisibleModal(false)
  }

  return (
    <MenuNavigationRouter path={{ activeMenu: '/app/calendar' }}>
      <ConfigProvider locale={ptBR}>
        {listData ? (
          <CalendarAnt dateCellRender={dateCellRender} onSelect={onSelect} />
        ) : (
            <CalendarAnt />
          )}
        <Modal
          title={date && `${date.date()}/${date.month()}/${date.year()}`}
          visible={visibleModal}
          onCancel={handleCloseModal}
          footer={null}
        >
          <CelendarTable data={date && getListData(date)} />
        </Modal>
      </ConfigProvider>
    </MenuNavigationRouter>
  )
}

Calendar.prototype = {
  eventsList: PropTypes.object.isRequired,
  fetchEvents: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  eventsList: state.eventsList
})

const mapDispatchToProps = {
  fetchEvents: EventsListStore.fetchEvents
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar)
