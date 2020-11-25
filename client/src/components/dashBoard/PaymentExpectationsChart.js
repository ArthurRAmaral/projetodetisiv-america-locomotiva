import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { message, Tabs, Spin, Card } from 'antd'

import ExpectedPaymentChart from '../charts/ExpectedPaymentChart'
import * as TeamListStore from '../../store/ducks/teamList'

const PaymentExpectationsChart = ({ teamList, fetchTeamList }) => {
  const { TabPane } = Tabs

  const [teamListData, setTeamListData] = useState()

  const hasTeamList = () => (teamList ? teamList.length > 0 : false)

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchTeamList()
      } catch (error) {
        message.error('Erro ao buscar os times. Tente recarregar a página.')
      }
    }

    if (!hasTeamList()) {
      fetchData()
    }

    if (!teamListData && hasTeamList()) {
      createTeamListData()
    }
  })

  const createTeamListData = () => {
    setTeamListData([...teamList])
  }

  return (
    <Card title="Projeções de Mensalidades" style={{ width: '100%' }}>
      {teamListData ? (
        <Tabs defaultActiveKey="0">
          <TabPane tab="Geral" key="0">
            <ExpectedPaymentChart />
          </TabPane>
          {teamListData.map(team => (
            <TabPane tab={team.name} key={team.id}>
              <ExpectedPaymentChart teamName={team.name} />
            </TabPane>
          ))}
        </Tabs>
      ) : (
          <Spin />
        )}
    </Card>
  )
}

const mapStateToProps = state => ({
  teamList: state.teamList
})

const mapDispatchToProps = {
  fetchTeamList: TeamListStore.fetchTeamList
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentExpectationsChart)
