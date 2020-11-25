import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, message, Typography, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import PlansTable from '../../components/plan/PlansTable'
import PlanEditModal from '../../components/plan/PlanEditModal'

import * as planListStore from '../../store/ducks/planList'

const { Paragraph, Title } = Typography

class PlanListingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      editModalVisible: false,
      selectedPlan: null,
    }
  }

  componentDidMount = async () => {
    const { fetchPlans } = this.props
    document.title = 'Planos - Motorman'

    try {
      await fetchPlans()
    } catch (error) {
      message.error('Ocorreu um erro de conexão ao tentar buscar a lista de planos.')
    }
    this.setState({ loading: false })
  }

  showCreateModal = () => this.showEditModal()

  showEditModal = plan => {
    this.setState({
      selectedPlan: plan,
      editModalVisible: true,
    })
  }

  hideEditModal = () => this.setState({ selectedPlan: null, editModalVisible: false })

  handleModalSubmit = plan => {
    if (plan.id) {
      this.handleEditSubmit(plan)
    } else {
      this.handleCreateSubmit(plan)
    }
  }

  handleEditSubmit = async plan => {
    const { updatePlan } = this.props
    const key = 'updatePlanKey'
    try {
      message.loading({ content: 'Aguarde...', key, duration: 0 })
      await updatePlan(plan)
      message.success({ content: 'Plano atualizado com sucesso!', key })
      this.hideEditModal()
    } catch (error) {
      message.error({ content: 'Ocorreu um erro ao tentar atualizar o plano de pagamento.', key })
    }
  }

  handleCreateSubmit = async plan => {
    const { createPlan } = this.props
    const key = 'createPlanKey'
    try {
      message.loading({ content: 'Aguarde...', key, duration: 0 })
      await createPlan(plan)
      message.success({ content: 'Plano criado com sucesso!', key })
      this.hideEditModal()
    } catch (error) {
      message.error({ content: 'Ocorreu um erro ao tentar criar o plano de pagamento.', key })
    }
  }

  handleDeleteClick = async plan => {
    const { removePlan } = this.props
    const key = 'removePlanKey'
    try {
      message.loading({ content: 'Aguarde...', key, duration: 0 })
      await removePlan(plan.id)
      message.success({ content: 'Plano removido com sucesso!', key })
    } catch (error) {
      message.error({ content: 'Ocorreu um erro ao tentar criar o plano de pagamento.', key })
    }
  }

  handleRestoreClick = async plan => {
    const { restorePlan } = this.props
    const key = 'restorePlanKey'
    try {
      message.loading({ content: 'Aguarde...', key, duration: 0 })
      await restorePlan(plan.id)
      message.success({ content: 'Plano removido com sucesso!', key })
    } catch (error) {
      message.error({ content: 'Ocorreu um erro ao tentar criar o plano de pagamento.', key })
    }
  }

  render() {
    const { plans } = this.props
    const { loading, editModalVisible, selectedPlan } = this.state

    return (
      <Card>
        <Title>Planos de pagamento</Title>
        <Paragraph>Todos os planos cadastrados no sistema</Paragraph>

        <div className="mb-lg">
          <Button icon={<PlusOutlined />} onClick={this.showCreateModal}>
            Cadastrar plano
          </Button>
        </div>

        <PlansTable
          plans={plans}
          loading={loading}
          onEditClick={this.showEditModal}
          onDeleteClick={this.handleDeleteClick}
          onRestoreClick={this.handleRestoreClick}
        />

        <PlanEditModal
          plan={selectedPlan}
          visible={editModalVisible}
          onSubmit={this.handleModalSubmit}
          onCancel={this.hideEditModal}
        />
      </Card>
    )
  }
}

PlanListingPage.propTypes = {
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    })
  ).isRequired,
  createPlan: PropTypes.func.isRequired,
  fetchPlans: PropTypes.func.isRequired,
  updatePlan: PropTypes.func.isRequired,
  removePlan: PropTypes.func.isRequired,
  restorePlan: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  plans: state.planList,
})

const mapDispatchToProps = {
  fetchPlans: planListStore.fetchPlans,
  updatePlan: planListStore.updatePlan,
  removePlan: planListStore.removePlan,
  createPlan: planListStore.createPlan,
  restorePlan: planListStore.restorePlan,
}

export default connect(mapStateToProps, mapDispatchToProps)(PlanListingPage)
