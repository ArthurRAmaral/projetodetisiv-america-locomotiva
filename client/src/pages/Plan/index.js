import React from 'react'
import { Route, Switch } from 'react-router-dom'

import MenuNavigationRouter from '../../components/MenuNavigationRouter'
import NotFound from '../NotFound'

import PlanListingPage from './PlanListingPage'
import PlanDetailsPage from './PlanDetailsPage'
import AccessControl from '../../components/AccessControl'

function Plan() {
  return (
    <AccessControl permission="application/plans/manage">
      <MenuNavigationRouter path={{ activeMenu: 'admin', activeSubMenu: '/app/plan' }}>
        <Switch>
          <Route exact path="/app/plan">
            <PlanListingPage />
          </Route>
          <Route exact path="/app/plan/:id">
            <PlanDetailsPage />
          </Route>
          <Route path="/app/plan/*">
            <NotFound />
          </Route>
        </Switch>
      </MenuNavigationRouter>
    </AccessControl>
  )
}

export default Plan
