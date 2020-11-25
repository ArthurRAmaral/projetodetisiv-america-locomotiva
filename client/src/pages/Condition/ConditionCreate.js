import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Card, Col, message, Typography } from 'antd'

import { useHistory } from 'react-router-dom'
import * as conditionListStore from '../../store/ducks/conditionList'
import EditConditionForm from '../../components/forms/EditConditionForm'

const { Paragraph, Title } = Typography

function ConditionCreate({ createCondition }) {
  const history = useHistory()
  const key = 'loadingMessage'

  useEffect(() => {
    document.title = 'Condições - Motorman'
  })

  const handleSubmit = async data => {
    try {
      message.loading({ content: 'Aguarde...', key, duration: 0 })

      await createCondition(data)

      message.success({ content: 'Condição cadastrada com sucesso.', key })

      history.push(`/app/conditions/`)
    } catch (error) {
      message.error({
        content:
          'Ocorreu um erro ao tentar cadastrar a condição. Revise os dados e tente novamente.',
        key,
      })
    }
  }

  return (
    <Card>
      <Row>
        <Col span={24}>
          <div className="text-center mb-lg">
            <Title>Cadastrar Condição</Title>
            <Paragraph>Preencha o formulário abaixo para cadastrar uma nova condição</Paragraph>
          </div>
          <EditConditionForm onSubmit={handleSubmit} />
        </Col>
      </Row>
    </Card>
  )
}

ConditionCreate.propTypes = {
  createCondition: PropTypes.func.isRequired,
}

export default connect(null, {
  createCondition: conditionListStore.createCondition,
})(ConditionCreate)
