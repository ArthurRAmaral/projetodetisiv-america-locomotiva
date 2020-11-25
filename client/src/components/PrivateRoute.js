import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import * as authStore from '../store/ducks/auth'

class PrivateRoute extends Component {
  constructor(props) {
    super(props)
    this.state = {
      verifying: true,
    }
  }

  componentDidMount = async () => {
    const { checkAuthentication } = this.props
    await checkAuthentication()
    this.setState({ verifying: false })
  }

  render() {
    const { currentUser, children, ...rest } = this.props
    const { verifying } = this.state

    return (
      <Route
        /* eslint react/jsx-props-no-spreading: 0 */
        {...rest}
        render={({ location }) => {
          if (verifying) {
            return null
          }

          if (currentUser) {
            return children
          }

          return <Redirect to={{ pathname: '/login', state: { from: location } }} />
        }}
      />
    )
  }
}

PrivateRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.object]).isRequired,
  checkAuthentication: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
  }),
}

PrivateRoute.defaultProps = {
  currentUser: null,
}

const mapDispatchToProps = {
  checkAuthentication: authStore.checkAuthentication,
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
})

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute)
