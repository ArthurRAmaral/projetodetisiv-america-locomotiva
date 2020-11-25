import React, { useState, useEffect } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

import { Tabs } from 'antd'
import MenuNavigationRouter from '../../components/MenuNavigationRouter'
import NotFound from '../NotFound'
import ConditionList from './ConditionList'
import ConditionCreate from './ConditionCreate'
import ConditionDetail from './ConditionDetail'
import AccessControl from '../../components/AccessControl'

import TabContext from './ConditionContext'

const { TabPane } = Tabs

const conditionList = {
  component: <ConditionList />,
  key: '1',
  title: 'Lista de eventos',
  closable: false,
}

const conditionCreate = {
  component: <ConditionCreate />,
  key: '2',
  title: 'Criar evento',
  closable: true,
}

const eventDetail = id => {
  return {
    component: <ConditionDetail visualization="members" id={id} />,
    key: `details-${id}`,
    title: 'Detalhes do evento',
    closable: true,
  }
}

const choosePane = (key, id) => {
  switch (key) {
    case '2':
      return conditionCreate
    case '3':
      return eventDetail(id)
    default:
      return '1'
  }
}

function Condition() {
  const [panes, setPanes] = useState([conditionList])
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
    <AccessControl permission="application/conditions/manage">
      <MenuNavigationRouter path={{ activeMenu: 'admin', activeSubMenu: '/app/conditions' }}>
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
          <Route exact path="/app/conditions/*">
            <NotFound />
          </Route>
        </Switch>
      </MenuNavigationRouter>
    </AccessControl>
  )
}

export default Condition
