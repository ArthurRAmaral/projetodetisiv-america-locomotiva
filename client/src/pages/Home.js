import React, { useEffect } from 'react'
import { Row, Col, Collapse } from 'antd'
import MenuNavigationRouter from '../components/MenuNavigationRouter'
import EventList from '../components/dashBoard/EventList'
import BirthdayList from '../components/dashBoard/BirthdayList'
import RolesChart from '../components/dashBoard/RolesChart'
import PlansChart from '../components/dashBoard/PlansChart'
import PaymentExpectationsChart from '../components/dashBoard/PaymentExpectationsChart'

import AgeRangeChart from '../components/dashBoard/AgeRangeChart'


function Home() {
  useEffect(() => {
    document.title = 'Home - Motorman'
  })

  const { Panel } = Collapse;

  return (
    <MenuNavigationRouter path={{ activeMenu: '/app' }}>
      {/* <Typography.Title className="text-center">Olá, seja bem-vindo(a)!</Typography.Title> */}
      <Row gutter={[16]}>
        <Col className="gutter-row" span={16}>
          <Collapse defaultActiveKey={['1', '2', '3', '4']}>

            <Panel header="Gráfico de Mensalidades" key="3" >
              <PaymentExpectationsChart />
            </Panel>

            <Panel header="Gráfico de Funções" key="4" >
              <RolesChart />
            </Panel>

            <Panel header="Gráfico de Faixa Etária" key="2" >
              <AgeRangeChart />
            </Panel>

            <Panel header="Gráfico de Planos" key="1" >
              <PlansChart />
            </Panel>

          </Collapse>
        </Col>
        <Col className="gutter-row" span={8} >
          <EventList />
          <BirthdayList />
        </Col>
      </Row>
    </MenuNavigationRouter>
  )
}

export default Home
