import React, { useState, useEffect } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

import { Tabs } from 'antd'
import MenuNavigationRouter from '../../components/MenuNavigationRouter'
import NotFound from '../NotFound'

import UserList from './UserList'
import UserEdit from './UserEdit'
import UserCreate from './UserCreate'
import UserDetail from './UserDetail'
import AccessControl from '../../components/AccessControl'

import TabContext from './UserContext'

const { TabPane } = Tabs

const userList = {
  component: <UserList />,
  key: '1',
  title: 'Lista de usário',
  closable: false,
}

const userCreate = {
  component: <UserCreate />,
  key: '2',
  title: 'Criar usuário',
  closable: true,
}

const userDetail = id => {
  return {
    component: <UserDetail id={id} />,
    key: `details-${id}`,
    title: 'Detalhes do usuário',
    closable: true,
  }
}

const userEdit = id => {
  return {
    component: <UserEdit id={id} />,
    key: `edit-${id}`,
    title: 'Editar usuário',
    closable: true,
  }
}

const choosePane = (key, id) => {
  switch (key) {
    case '2':
      return userCreate
    case '3':
      return userDetail(id)
    case '4':
      return userEdit(id)
    default:
      return '1'
  }
}

function User() {
  const [panes, setPanes] = useState([userList])
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
    <AccessControl permission="application/users/manage">
      <MenuNavigationRouter path={{ activeMenu: 'admin', activeSubMenu: '/app/user' }}>
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
          <Route path="/app/user/*">
            <NotFound />
          </Route>
        </Switch>
      </MenuNavigationRouter>
    </AccessControl>
  )
}

export default User
