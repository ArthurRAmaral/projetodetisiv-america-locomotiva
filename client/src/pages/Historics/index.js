import React, { useEffect, useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

import { Tabs } from 'antd'
import MenuNavigationRouter from '../../components/MenuNavigationRouter'
import NotFound from '../NotFound'
import HistoricList from './HistoricList'
import HistoricCreate from './HistoricCreate'
import HistoricDetails from './HistoricDetails'
import HistoricEdit from './HistoricEdit'
// import AccessControl from '../../components/AccessControl'

import TabContext from './HistoricContext'

const { TabPane } = Tabs

const historicList = {
  component: <HistoricList />,
  key: '1',
  title: 'Lista de tipos de históricos',
  closable: false
}

const historicCreate = {
  component: <HistoricCreate />,
  key: '2',
  title: 'Criar tipo de histórico',
  closable: true
}

const historicDetail = id => ({
  component: <HistoricDetails id={id} />,
  key: `detail-${id}`,
  title: 'Relatório',
  closable: true
})

const historicEdit = id => {
  return {
    component: <HistoricEdit id={id} />,
    key: `edit-${id}`,
    title: 'Editar tipo de histórico',
    closable: true
  }
}

const choosePane = (key, id) => {
  switch (key) {
    case '2':
      return historicCreate
    case '3':
      return historicDetail(id)
    case '4':
      return historicEdit(id)
    default:
      return '1'
  }
}

function Home() {
  const [panes, setPanes] = useState([historicList])
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

  useEffect(() => {
    document.title = 'Históricos - Motorman'
  })
  return (
    // <AccessControl permission="application/conditions/manage">
    <MenuNavigationRouter path={{ activeMenu: '/app/historics' }}>
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
        <Route exact path="/app/historics/*">
          <NotFound />
        </Route>
      </Switch>
    </MenuNavigationRouter>
    // </AccessControl>
  )
}

export default Home
