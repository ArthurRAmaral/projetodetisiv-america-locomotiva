import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, message, Typography, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ConditionTable from '../../components/conditions/ConditionTable'

import * as conditionListStore from '../../store/ducks/conditionList'

import TabContext from './ConditionContext'

const { Paragraph, Title } = Typography

class ConditionList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      conditions: [],
    }
  }

  componentDidMount = async () => {
    const { fetchConditions } = this.props
    document.title = 'Condições - Motorman'

    this.setState({ loading: true })

    try {
      const { conditions } = await fetchConditions()
      this.setState({ conditions })
    } catch (error) {
      message.error('Ocorreu um erro de conexão ao tentar buscar a lista de condições.')
    }

    this.setState({ loading: false })
  }

  render() {
    const { conditions } = this.state
    const { loading } = this.state
    return (
      <Card>
        <Title>Condições</Title>
        <Paragraph>Todas as condições cadastrados no sistema</Paragraph>

        <div className="mb-lg">
          <TabContext.Consumer>
            {addTab => (
              <Button onClick={() => addTab('2')} path="/app/event/create" icon={<PlusOutlined />}>
                Cadastrar condição
              </Button>
            )}
          </TabContext.Consumer>
        </div>
        <ConditionTable conditions={conditions || []} loading={loading} />
      </Card>
    )
  }
}

ConditionList.propTypes = {
  fetchConditions: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  conditions: state.conditionList,
})

const mapDispatchToProps = {
  fetchConditions: conditionListStore.fetchConditions,
}

export default connect(mapStateToProps, mapDispatchToProps)(ConditionList)
