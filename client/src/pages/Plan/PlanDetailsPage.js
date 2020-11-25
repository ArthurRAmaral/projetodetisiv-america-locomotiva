import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Skeleton, Card, Button, message } from 'antd'

import { ArrowLeftOutlined } from '@ant-design/icons'
import * as planStore from '../../store/ducks/plan'
import * as paymentStore from '../../store/ducks/payments'
import PlanDetails from '../../components/plan/PlanDetails'
import NotFound from '../NotFound'
import PlanEditModal from '../../components/plan/PlanEditModal'
import PaymentModal from '../../components/payment/PaymentModal'
import GeneratePaymentModal from '../../components/plan/GeneratePaymentModal'
import TogglePlanStatusButton from '../../components/plan/TogglePlanStatusButton'

import api from '../../services/api'

class PlanDetailsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      modalVisible: false,
      generateModalVisible: false,
      paymentModalVisible: false
    }
  }

  componentDidMount = async () => {
    const { match, fetchPlan, fetchPayments } = this.props
    const { params } = match
    const { id } = params
    document.title = 'Planos - Motorman'

    try {
      await fetchPayments(id)
      await fetchPlan(id)
    } catch (error) {
      // plan not found, will render NotFound component after loading
    }

    this.setState({ loading: false })
  }

  showPaymentModal = () => this.setState({ paymentModalVisible: true })

  hidePaymentModal = () => this.setState({ paymentModalVisible: false })

  handlePaymentSubmit = async values => {
    const { plan, fetchPayments, fetchPlan } = this.props
    const key = 'createPaymentKey'
    try {
      message.loading({ content: 'Aguarde...', key, duration: 0 })

      this.setState({ loading: true })
      for (let id of values.user_id) {
        const payment = {
          user_id: id,
          plan_id: plan.id,
          value: values.value,
          due_date: values.due_date
        }
        await api.post(`/payments/`, payment)
        await fetchPayments(plan.id)
        await fetchPlan(plan.id)
      }
      message.success({ content: 'Mensalidade gerada com sucesso!', key })
      this.hidePaymentModal()
    } catch (error) {
      message.error({
        content: 'Ocorreu um erro ao tentar criar o plano de pagamento.',
        key
      })
    }
    this.setState({ loading: false })
  }

  showGenerateModal = () => this.setState({ generateModalVisible: true })

  hideGenerateModal = () => this.setState({ generateModalVisible: false })

  handleGenerateSubmit = async values => {
    const { plan, fetchPayments, fetchPlan } = this.props
    const key = 'generatePaymentsKey'
    try {
      message.loading({ content: 'Aguarde...', key, duration: 0 })
      this.setState({ loading: true })
      await api.post(`/payments/generate/${plan.id}`, values)
      fetchPayments(plan.id)
      fetchPlan(plan.id)
      message.success({ content: 'Mensalidades geradas com sucesso!', key })
      this.hideGenerateModal()
    } catch (error) {
      message.error({
        content: 'Ocorreu um erro ao tentar criar o plano de pagamento.',
        key
      })
    }
    this.setState({ loading: false })
  }

  showEditModal = () => this.setState({ modalVisible: true })

  hideEditModal = () => this.setState({ modalVisible: false })

  handleEditSubmit = async plan => {
    const { updatePlan } = this.props
    const key = 'updatePlanKey'
    try {
      message.loading({ content: 'Aguarde...', key, duration: 0 })
      await updatePlan(plan)
      this.hideEditModal()
      message.success({ content: 'Plano atualizado com sucesso!', key })
    } catch (error) {
      message.error({
        content: 'Ocorreu um erro ao tentar atualizar o plano de pagamento.',
        key
      })
    }
  }

  render() {
    const { plan, payments, removePlan, restorePlan } = this.props

    const {
      loading,
      modalVisible,
      generateModalVisible,
      paymentModalVisible
    } = this.state

    return plan || loading ? (
      <div>
        <Card>
          <div className="mb-md">
            <Link to="/app/plan">
              <ArrowLeftOutlined /> Retornar à lista
            </Link>
          </div>

          <Skeleton active loading={loading}>
            <div className="mb-md">
              <Button
                className="br-sm"
                size="small"
                onClick={this.showEditModal}
              >
                Editar plano
              </Button>
              <Button
                className="br-sm"
                size="small"
                onClick={this.showPaymentModal}
              >
                Criar Mensaldiade
              </Button>
              <Button
                className="br-sm"
                size="small"
                onClick={this.showGenerateModal}
              >
                Gerar mensalidades
              </Button>

              <TogglePlanStatusButton
                plan={plan}
                onDeleteClick={({ id }) => removePlan(id)}
                onRestoreClick={({ id }) => restorePlan(id)}
              />
            </div>

            <PlanDetails plan={plan} payments={payments} />

            <PlanEditModal
              plan={plan}
              visible={modalVisible}
              onCancel={this.hideEditModal}
              onSubmit={this.handleEditSubmit}
            />
            <GeneratePaymentModal
              plan={plan}
              visible={generateModalVisible}
              onCancel={this.hideGenerateModal}
              onSubmit={this.handleGenerateSubmit}
            />
            <PaymentModal
              visible={paymentModalVisible}
              onCancel={this.hidePaymentModal}
              onSubmit={this.handlePaymentSubmit}
              planValue={plan.monthlyPrice}
              planUsers={plan.users}
            />
          </Skeleton>
        </Card>
      </div>
    ) : (
      <NotFound />
    )
  }
}

PlanDetailsPage.propTypes = {
  fetchPlan: PropTypes.func.isRequired,
  fetchPayments: PropTypes.func.isRequired,
  updatePlan: PropTypes.func.isRequired,
  restorePlan: PropTypes.func.isRequired,
  removePlan: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired,
  plan: PropTypes.shape({
    id: PropTypes.number
  }).isRequired
}

const mapStateToProps = state => ({
  plan: state.plan,
  payments: state.payments
})

const mapDispatchToProps = {
  fetchPayments: paymentStore.fetchPayments,
  fetchPlan: planStore.fetchPlan,
  updatePlan: planStore.updatePlan,
  restorePlan: planStore.restorePlan,
  removePlan: planStore.removePlan
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PlanDetailsPage))
