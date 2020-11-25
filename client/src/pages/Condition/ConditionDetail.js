import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Skeleton, Card, message, Row, Col, Typography } from 'antd'
import * as conditionListStore from '../../store/ducks/conditionList'
import NotFound from '../NotFound'
import RemoveConditionButton from '../../components/conditions/RemoveConditionButton'
import ConditionMemberList from '../../components/conditions/ConditionMemberList'

const { Title } = Typography

class ConditionDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      condition: null,
    }
  }

  componentDidMount = async () => {
    const { id, fetchCondition } = this.props

    document.title = 'Condições - Motorman'

    try {
      const { condition } = await fetchCondition(id)
      this.setState({ condition })
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          message.error('Não foi encontrada essa condição')
        }
      } else {
        message.error('Ocorreu um erro de conexão ao tentar buscar os dados da condição.')
      }
    }

    this.setState({ loading: false })
  }

  render() {
    const { condition } = this.state
    const { loading } = this.state

    if (loading) {
      return (
        <Card>
          <Skeleton active avatar paragraph={3} />
        </Card>
      )
    }

    if (condition) {
      return (
        <Card>
          <Row className="mb-lg">
            <Col xs={24} md={12}>
              <Title level={2}>{condition.name}</Title>
            </Col>
            <Col xs={24} md={12}>
              <Row justify="end">
                <RemoveConditionButton condition={condition} />
              </Row>
            </Col>
          </Row>
          <Row className="mb-lg">
            <Col xs={24}>
              <ConditionMemberList condition={condition} />
            </Col>
          </Row>
        </Card>
      )
    }

    return <NotFound />
  }
}

ConditionDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  fetchCondition: PropTypes.func.isRequired,
  condition: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    color: PropTypes.string,
  }),
}

ConditionDetail.defaultProps = {
  condition: null,
}

const mapDispatchToProps = {
  fetchCondition: conditionListStore.fetchCondition,
}

const mapStateToProps = state => ({
  team: state.team,
})

const ConditionDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ConditionDetail))

export default ConditionDetailContainer
