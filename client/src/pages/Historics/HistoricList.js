import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, message, Typography, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import HistoricTable from '../../components/historicTypes/HistoricTable'

import * as historicTypesStore from '../../store/ducks/historicTypes'

import TabContext from './HistoricContext'

const { Title } = Typography

class HistoricList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount = async () => {
    const { fetchHistoricTypes } = this.props
    document.title = 'Históricos - Motorman'

    this.setState({ loading: true })

    try {
      await fetchHistoricTypes()
      this.setState({ loading: false })
    } catch (error) {
      message.error(
        'Ocorreu um erro de conexão ao tentar buscar a lista de condições.'
      )
    }
  }

  render() {
    const { historicTypes } = this.props
    const { loading } = this.state
    return (
      <Card>
        <Title>Tipos de Históricos</Title>

        <div className="mb-lg">
          <TabContext.Consumer>
            {addTab => (
              <Button
                onClick={() => addTab('2')}
                path="/app/historics/create"
                icon={<PlusOutlined />}
              >
                Cadastrar tipo de histórico
              </Button>
            )}
          </TabContext.Consumer>
        </div>
        <HistoricTable historicTypes={historicTypes} loading={loading} />
      </Card>
    )
  }
}

HistoricList.propTypes = {
  fetchHistoricTypes: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  historicTypes: state.historicTypes
})

const mapDispatchToProps = {
  fetchHistoricTypes: historicTypesStore.fetchHistoricTypes,
  deleteHistoricType: historicTypesStore.deleteHistoricType
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoricList)
