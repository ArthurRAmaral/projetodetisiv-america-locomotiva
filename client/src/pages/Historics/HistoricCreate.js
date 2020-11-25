import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Row, Card, Col, message, Typography } from 'antd'

import { useHistory } from 'react-router-dom'
import * as hytoricTypeStore from '../../store/ducks/historicTypes'
import EditHistoricTypeForm from '../../components/forms/EditHistoricTypeForm'

const { Paragraph, Title } = Typography

function HistoricCreate({ createHistoricType }) {
  const history = useHistory()
  const key = 'loadingMessage'

  useEffect(() => {
    document.title = 'Históricos - Motorman'
  })

  const handleSubmit = async data => {
    try {
      message.loading({ content: 'Aguarde...', key, duration: 0 })

      createHistoricType(data)

      message.success({
        content: 'Tipo de histórico cadastrada com sucesso.',
        key
      })

      history.push(`/app/historics/`)
    } catch (error) {
      if (error.response)
        switch (error.response.status) {
          case 409:
            message.error({
              content: 'Esse tipo de histórico já existe.',
              key
            })
            break
          default:
            message.error({
              content:
                'Ocorreu um erro ao tentar cadastrar a condição. Revise os dados e tente novamente.',
              key
            })
            break
        }
      else
        message.error({
          content:
            'Ocorreu um erro ao tentar cadastrar a condição. Revise os dados e tente novamente.',
          key
        })
    }
  }

  return (
    <Card>
      <Row>
        <Col span={24}>
          <div className="text-center mb-lg">
            <Title>Cadastrar Tipo Histórico</Title>
            <Paragraph>
              Preencha o formulário abaixo para cadastrar um novo tipo de
              histórico
            </Paragraph>
          </div>
          <EditHistoricTypeForm onSubmit={handleSubmit} />
        </Col>
      </Row>
    </Card>
  )
}

const mapDispatchToProps = {
  createHistoricType: hytoricTypeStore.createHistoricType
}

export default connect(null, mapDispatchToProps)(HistoricCreate)
