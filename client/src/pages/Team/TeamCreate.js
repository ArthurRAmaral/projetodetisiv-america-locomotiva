import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Card, Col, message, Typography } from 'antd'

import { useHistory } from 'react-router-dom'
import * as teamStore from '../../store/ducks/team'
import EditTeamForm from '../../components/forms/EditTeamForm'

const { Paragraph, Title } = Typography

function TeamCreate({ createTeam }) {
  const history = useHistory()
  const key = 'loadingMessage'

  useEffect(() => {
    document.title = 'Times - Motorman'
  })

  const handleSubmit = async data => {
    try {
      message.loading({ content: 'Aguarde...', key, duration: 0 })

      const { payload: team } = await createTeam(data)

      message.success({ content: 'Time cadastrado com sucesso.', key })

      history.push(`/app/team/${team.id}`)
    } catch (error) {
      message.error({
        content: 'Ocorreu um erro ao tentar cadastrar o time. Revise os dados e tente novamente.',
        key,
      })
    }
  }

  return (
    <Card>
      <Row>
        <Col span={24}>
          <div className="text-center mb-lg">
            <Title>Cadastrar time</Title>
            <Paragraph>Preencha o formulário abaixo para cadastrar um novo time</Paragraph>
          </div>
          <EditTeamForm onSubmit={handleSubmit} />
        </Col>
      </Row>
    </Card>
  )
}

TeamCreate.propTypes = {
  createTeam: PropTypes.func.isRequired,
}

export default connect(null, {
  createTeam: teamStore.createTeam,
})(TeamCreate)
