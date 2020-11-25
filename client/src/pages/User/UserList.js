import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import qs from 'query-string'
import { useLocation, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Card, message, Typography, Button } from 'antd'
// import { PlusOutlined } from '@ant-design/icons'

import UserFilteredTable from '../../components/user/UserFilteredTable'
// import RedirectButton from '../../components/RedirectButton'
import UserFilterForm from '../../components/forms/UserFilterForm'
import * as userListStore from '../../store/ducks/userList'
import * as planListStore from '../../store/ducks/planList'
import TabContext from './UserContext'

const { Paragraph, Title } = Typography

function UserList({ users, fetchUsers, updateUser, plans, fetchPlans }) {
  const location = useLocation()
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState(qs.parse(location.search))

  useEffect(() => {
    document.title = 'Usuários - Motorman'
    fetchPlans()
  }, [fetchPlans])

  // mudar a url quando a query mudar
  useEffect(() => {
    const queryString = qs.stringify(query)
    history.push(`${history.location.pathname}?${queryString.replace(/\?/, '')}`)
  }, [query, history])

  // buscar usando a query quando a url mudar
  useEffect(() => {
    setLoading(true)
    console.log(qs.parse(location.search))
    fetchUsers(qs.parse(location.search))
      .catch(() => {
        message.error('Ocorreu um erro de conexão ao tentar buscar a lista de usuários.')
      })
      .finally(() => setLoading(false))
  }, [fetchUsers, location.search])

  const handleTableChange = (pagination, filters, sorter) => {
    const { order, field, ...rest } = query
    const newQuery = { ...rest, page: pagination.current }
    if (sorter.order) {
      newQuery.order = sorter.order === 'ascend' ? sorter.order : 'descend'
      newQuery.field = sorter.field
    }
    setQuery(newQuery)
  }

  const addTab = useContext(TabContext)

  return (
    <Card>
      <Title>Usuários</Title>
      <Paragraph>Todos os usuários cadastrados no sistema</Paragraph>

      <div className="mb-lg">
        <Button onClick={() => addTab('2')}>Cadastrar usuário</Button>
      </div>

      <div className="mb-lg">
        <UserFilterForm values={qs.parse(location.search)} onSubmit={setQuery} plans={plans} />
      </div>

      <UserFilteredTable
        pagination={{
          current: users.page,
          pageSize: users.perPage,
          total: users.total,
        }}
        sortInfo={{
          field: query.field || 'created_at',
          order: query.order || 'ascend',
        }}
        users={users.data}
        loading={loading}
        onChange={handleTableChange}
        onUserChange={updateUser}
        footer={() => `Exibindo ${users.data.length} de ${users.total} resultados`}
      />
    </Card>
  )
}

UserList.propTypes = {
  users: PropTypes.shape({
    total: PropTypes.string,
    perPage: PropTypes.number,
    lastPage: PropTypes.number,
    page: PropTypes.number,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
      })
    ),
  }).isRequired,
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ).isRequired,
  fetchUsers: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  fetchPlans: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  users: state.userList,
  plans: state.planList,
})

const mapDispatchToProps = {
  fetchUsers: userListStore.fetchUsers,
  updateUser: userListStore.userUpdated,
  fetchPlans: planListStore.fetchPlans,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList)
