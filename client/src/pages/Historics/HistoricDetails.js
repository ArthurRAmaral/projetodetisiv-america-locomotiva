import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Skeleton, Card, message, Row, Col, Typography } from 'antd'
import * as historicTypeUsersStore from '../../store/ducks/historicTypeUsers'
import NotFound from '../NotFound'
// import RemoveConditionButton from '../../components/conditions/RemoveConditionButton'
import HistoricMemberList from '../../components/historicTypes/HistoricMemberList'

const { Title } = Typography

class HistoricDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      historicType: null,
      users: []
    }
  }

  componentDidMount = async () => {
    const { id, fetchHistoricTypeWithUsers, historicTypes } = this.props

    document.title = 'Tipo de histórico - Motorman'

    try {
      const historicType = historicTypes.find(
        historicType => historicType.id === id
      )
      this.setState({ historicType })

      await fetchHistoricTypeWithUsers(id)
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          message.error('Não foi encontrado o tipo de histórico')
        }
      } else {
        message.error(
          'Ocorreu um erro de conexão ao tentar buscar os dados da condição.'
        )
      }
    }

    this.setState({ loading: false })
  }

  render() {
    const { historicType, loading } = this.state
    const { historicTypeUsers } = this.props

    if (loading) {
      return (
        <Card>
          <Skeleton active avatar paragraph={3} />
        </Card>
      )
    }
    if (historicType) {
      return (
        <Card>
          <Row className="mb-lg">
            <Col xs={24} md={12}>
              <Title level={2}>{historicType.type}</Title>
            </Col>
            <Col xs={24} md={12}>
              <Row justify="end">
                {/* <RemoveConditionButton condition={historicType} /> */}
              </Row>
            </Col>
          </Row>
          <Row className="mb-lg">
            <Col xs={24}>
              <HistoricMemberList users={historicTypeUsers} />
            </Col>
          </Row>
        </Card>
      )
    }

    return <NotFound />
  }
}

const mapDispatchToProps = {
  fetchHistoricTypeWithUsers: historicTypeUsersStore.fetchHistoricTypeWithUsers
}

const mapStateToProps = state => ({
  team: state.team,
  historicTypes: state.historicTypes,
  historicTypeUsers: state.historicTypeUsers
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HistoricDetail))
