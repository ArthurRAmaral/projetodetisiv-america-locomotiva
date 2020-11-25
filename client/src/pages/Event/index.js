import React, { useState, useEffect } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

import { Tabs } from 'antd'
import MenuNavigationRouter from '../../components/MenuNavigationRouter'
import NotFound from '../NotFound'

import EventList from './EventList'
import EventEdit from './EventEdit'
import EventCreate from './EventCreate'
import EventDetail from './EventDetail'
import AccessControl from '../../components/AccessControl'

import TabContext from './EventContext'

const { TabPane } = Tabs

const eventList = {
  component: <EventList />,
  key: '1',
  title: 'Lista de eventos',
  closable: false,
}

const eventCreate = {
  component: <EventCreate />,
  key: '2',
  title: 'Criar evento',
  closable: true,
}

const eventDetail = id => {
  return {
    component: <EventDetail id={id} />,
    key: `details-${id}`,
    title: 'Detalhes do evento',
    closable: true,
  }
}

const eventEdit = id => {
  return {
    component: <EventEdit id={id} />,
    key: `edit-${id}`,
    title: 'Editar evento',
    closable: true,
  }
}

const choosePane = (key, id) => {
  switch (key) {
    case '2':
      return eventCreate
    case '3':
      return eventDetail(id)
    case '4':
      return eventEdit(id)
    default:
      return '1'
  }
}

function Event() {
  const [panes, setPanes] = useState([eventList])
  const [activeKey, setActiveKey] = useState('1')

  const addPane = (key, id, nameId) => {
    const newKey = id ? `${nameId}-${id}` : key

    const alreadyExist = panes.find(pane => pane.key === newKey)

    if (!alreadyExist) {
      const newPane = choosePane(key, id)
      setPanes([...panes, newPane])
    }

    if (id && nameId) {
      const removedPane = panes.filter(pane => {
        const removedId = pane.key.split('-')[0]
        return removedId !== nameId
      })
      const newPane = choosePane(key, id)
      setPanes([...removedPane, newPane])
    }

    setActiveKey(newKey)
  }

  const onChange = key => {
    setActiveKey(key)
  }

  const closeTab = key => {
    const newPanes = panes.filter(pane => pane.key !== key)
    setPanes([...newPanes])
    setActiveKey('1')
  }

  const { location } = useHistory()

  useEffect(() => {
    if (location.state) {
      addPane(location.state.render, location.state.id, location.state.nameId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

  return (
    <AccessControl permission="application/events/manage">
      <MenuNavigationRouter path={{ activeMenu: 'admin', activeSubMenu: '/app/event' }}>
        <Switch>
          <TabContext.Provider value={addPane}>
            <Tabs
              type="editable-card"
              hideAdd
              activeKey={activeKey}
              onChange={onChange}
              onEdit={closeTab}
            >
              {panes.map(data => (
                <TabPane tab={data.title} key={data.key} closable={data.closable}>
                  {data.component}
                </TabPane>
              ))}
            </Tabs>
          </TabContext.Provider>
          <Route exact path="/app/event/*">
            <NotFound />
          </Route>
        </Switch>
      </MenuNavigationRouter>
    </AccessControl>
  )
}

export default Event
