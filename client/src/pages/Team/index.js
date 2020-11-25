import React, { useState, useEffect } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

import { Tabs } from 'antd'
import MenuNavigationRouter from '../../components/MenuNavigationRouter'
import NotFound from '../NotFound'
import TeamList from './TeamList'
import TeamEdit from './TeamEdit'
import TeamCreate from './TeamCreate'
import TeamDetail from './TeamDetail'
import AccessControl from '../../components/AccessControl'

import TabContext from './TeamContext'

const { TabPane } = Tabs

const teamList = {
  component: <TeamList />,
  key: '1',
  title: 'Lista de Times',
  closable: false,
}

const teamCreate = {
  component: <TeamCreate />,
  key: '2',
  title: 'Criar Time',
  closable: true,
}

const teamDetail = id => {
  return {
    component: <TeamDetail id={id} />,
    key: `details-${id}`,
    title: 'Detalhes do Time',
    closable: true,
  }
}

const teamEdit = id => {
  return {
    component: <TeamEdit id={id} />,
    key: `edit-${id}`,
    title: 'Editar Time',
    closable: true,
  }
}

const choosePane = (key, id) => {
  switch (key) {
    case '2':
      return teamCreate
    case '3':
      return teamDetail(id)
    case '4':
      return teamEdit(id)
    default:
      return '1'
  }
}

function Team() {
  const [panes, setPanes] = useState([teamList])
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
    <AccessControl permission="application/teams/manage">
      <MenuNavigationRouter path={{ activeMenu: 'admin', activeSubMenu: '/app/team' }}>
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
          <Route exact path="/app/team/*">
            <NotFound />
          </Route>
        </Switch>
      </MenuNavigationRouter>
    </AccessControl>
  )
}

export default Team
