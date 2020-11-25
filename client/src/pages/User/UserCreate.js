import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Card, Col, message, Typography } from 'antd'

// import { useHistory } from 'react-router-dom'
import * as userStore from '../../store/ducks/user'
import * as planListStore from '../../store/ducks/planList'
import * as groupStore from '../../store/ducks/groups'
import EditUserForm from '../../components/forms/EditUserForm'

const { Paragraph, Title } = Typography

function UserCreate({ createUser, fetchPlans, fetchGroups }) {
  // const history = useHistory()
  const [plans, setPlans] = useState([])
  const [groups, setGroups] = useState([])

  useEffect(() => {
    document.title = 'Usuários - Motorman'
      ; (async () => {
        const plansResult = await fetchPlans()
        const groupsResult = await fetchGroups()
        setPlans(plansResult.plans)
        setGroups(groupsResult.groups)
      })()
  }, [fetchPlans, fetchGroups])

  const handleSubmit = async data => {
    const key = 'loadingMessage'

    try {
      message.loading({ content: 'Aguarde...', key, duration: 0 })
      await createUser(data)
      message.success({ content: 'Usuário cadastrado com sucesso.', key })
      // history.push(`/app/user/${user.id}`)
    } catch (error) {
      if (error.response) {
        message.error({
          content: error.response.data,
          key,
        })
      } else {
        message.error({
          content:
            'Ocorreu um erro ao tentar cadastrar o usuário. Revise os dados e tente novamente.',
          key,
        })
      }
    }
  }

  return (
    <div>
      <Card>
        <div className="text-center mb-lg">
          <Title>Cadastrar usuário</Title>
          <Paragraph>Preencha o formulário abaixo para cadastrar um novo usuário</Paragraph>
        </div>
        <Row justify="center">
          <Col xs={24} md={16} lg={12} xl={8}>
            <EditUserForm onSubmit={handleSubmit} plans={plans} groups={groups} />
          </Col>
        </Row>
      </Card>
    </div>
  )
}

UserCreate.propTypes = {
  createUser: PropTypes.func.isRequired,
  fetchPlans: PropTypes.func.isRequired,
  fetchGroups: PropTypes.func.isRequired,
}

export default connect(null, {
  createUser: userStore.createUser,
  fetchPlans: planListStore.fetchPlans,
  fetchGroups: groupStore.fetchGroups,
})(UserCreate)
