import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Input, message } from 'antd'

import * as userListStore from '../../store/ducks/userList'

class UserSearchInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  handleSearch = async fullName => {
    this.setState({ loading: true })

    try {
      const { searchUsers, onResult } = this.props
      const { results } = await searchUsers({ fullName })
      onResult(results.data)
    } catch (error) {
      message.error('Ocorreu um erro ao tentar pesquisar os usuários.')
    }
    this.setState({ loading: false })
  }

  render() {
    const { loading } = this.state
    return (
      <Input.Search
        className="mb-md"
        placeholder="Aperte Enter para pesquisar"
        onSearch={this.handleSearch}
        loading={loading}
      />
    )
  }
}

UserSearchInput.propTypes = {
  onResult: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
  searchUsers: userListStore.searchUsers,
}

export default connect(null, mapDispatchToProps)(UserSearchInput)
