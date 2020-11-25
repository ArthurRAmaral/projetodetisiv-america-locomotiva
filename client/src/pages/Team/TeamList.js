import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, message, Typography, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import TeamTable from '../../components/times/TeamTable'

import * as teamListStore from '../../store/ducks/teamList'

import TabContext from './TeamContext'

const { Paragraph, Title } = Typography

class TeamList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  componentDidMount = async () => {
    const { fetchTeamList } = this.props
    document.title = 'Times - Motorman'

    this.setState({ loading: true })

    try {
      await fetchTeamList()
    } catch (error) {
      message.error('Ocorreu um erro de conexão ao tentar buscar a lista de times.')
    }

    this.setState({ loading: false })
  }

  render() {
    const { teams, teamUpdated } = this.props
    const { loading } = this.state
    return (
      <Card>
        <Title>Times</Title>
        <Paragraph>Todos os times cadastrados no sistema</Paragraph>

        <div className="mb-lg">
          <TabContext.Consumer>
            {addTab => (
              <Button onClick={() => addTab('2')} path="/app/team/create" icon={<PlusOutlined />}>
                Cadastrar time
              </Button>
            )}
          </TabContext.Consumer>
        </div>
        <TeamTable teams={teams || []} loading={loading} onTimesChange={teamUpdated} />
      </Card>
    )
  }
}

TeamList.propTypes = {
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    })
  ).isRequired,
  fetchTeamList: PropTypes.func.isRequired,
  teamUpdated: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  teams: state.teamList,
})

const mapDispatchToProps = {
  fetchTeamList: teamListStore.fetchTeamList,
  teamUpdated: teamListStore.teamUpdated,
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamList)
