import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Skeleton, Card, Row, Col, message } from 'antd'

import * as userStore from '../../store/ducks/user'
import * as historicItemsStore from '../../store/ducks/historicItem'
import UserDetailCard from '../../components/user/UserDetailCard'
import NotFound from '../NotFound'

class UserDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }
  }

  componentDidMount = async () => {
    const { id, fetchUser } = this.props
    document.title = 'Usuários - Motorman'

    try {
      await fetchUser(id)
    } catch (error) {
      message.error(
        'Ocorreu um erro ao buscar os detalhes do usuário. Você está conectado a internet?'
      )
    }

    this.setState({ loading: false })
  }

  render() {
    const { user } = this.props
    const { loading } = this.state

    if (loading) {
      return (
        <Card>
          <Skeleton avatar active paragraph={3} />
        </Card>
      )
    }

    if (user) {
      return (
        <div>
          <Card>
            <Row>
              <Col span={24}>
                <UserDetailCard user={user} />
              </Col>
            </Row>
          </Card>
        </div>
      )
    }

    return <NotFound />
  }
}

UserDetail.propTypes = {
  fetchUser: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
}

UserDetail.defaultProps = {
  user: null,
  historic: [],
}

const mapStateToProps = state => ({
  user: state.user,
  historic: state.historicItems,
})

const mapDispatchToProps = {
  fetchUser: userStore.fetchUser,
  fetchHistoricItemsPerUser: historicItemsStore.fetchHistoricItemsPerUser,
  deletedhistoricItem: historicItemsStore.deleteHistoricItem,
}

const UserDetailContainer = connect(mapStateToProps, mapDispatchToProps)(withRouter(UserDetail))

export default UserDetailContainer
