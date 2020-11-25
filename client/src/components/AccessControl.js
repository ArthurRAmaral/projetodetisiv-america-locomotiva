import { connect } from 'react-redux'
import { userHasPermission } from '../services/access-control'

function AccessControl({ currentUser, permission, teamId, children }) {
  return userHasPermission(currentUser, permission, teamId) ? children : null
}

const mapStateToProps = state => {
  return {
    currentUser: state.auth.currentUser,
  }
}

export default connect(mapStateToProps)(AccessControl)
