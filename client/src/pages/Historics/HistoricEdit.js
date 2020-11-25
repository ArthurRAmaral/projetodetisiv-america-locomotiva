import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Row, Card, Col, message, Typography } from 'antd'

import { useHistory } from 'react-router-dom'
import * as hytoricTypeStore from '../../store/ducks/historicTypes'
import EditHistoricTypeForm from '../../components/forms/EditHistoricTypeForm'

const { Paragraph, Title } = Typography

function HistoricEdit({ updateHistoricType, id }) {
  const history = useHistory()
  const key = 'loadingMessage'

  useEffect(() => {
    document.title = 'Históricos - Motorman'
  })

  const handleSubmit = async data => {
    try {
      message.loading({ content: 'Aguarde...', key, duration: 0 })

      await updateHistoricType(data)

      message.success({
        content: 'Tipo de histórico editado com sucesso.',
        key,
      })

      history.push(`/app/historics/`)
    } catch (error) {
      if (error.response)
        switch (error.response.status) {
          case 409:
            message.error({
              content: 'Já existe um tipo de histórico com esse nome.',
              key,
            })
            return
          default:
            break
        }
      message.error({
        content: 'Ocorreu um erro ao tentar editar a condição. Revise os dados e tente novamente.',
        key,
      })
    }
  }

  return (
    <Card>
      <Row>
        <Col span={24}>
          <div className="text-center mb-lg">
            <Title>Editar Tipo Histórico</Title>
            <Paragraph>Edite o formulário abaixo para atualizar o tipo de histórico</Paragraph>
          </div>
          <EditHistoricTypeForm historicTypeId={id} onSubmit={handleSubmit} />
        </Col>
      </Row>
    </Card>
  )
}

const mapDispatchToProps = {
  updateHistoricType: hytoricTypeStore.updateHistoricType,
}

export default connect(null, mapDispatchToProps)(HistoricEdit)
