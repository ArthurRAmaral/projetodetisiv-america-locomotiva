import React from 'react'
import PropTypes from 'prop-types'
import { List, Button } from 'antd'
import UserAvatar from '../user/UserAvatar'

const AddMemberListItem = ({ user, danger, content, actionText, onActionClick }) => (
  <List.Item
    actions={[
      <Button danger={danger} type="link" onClick={onActionClick}>
        {actionText}
      </Button>,
    ]}
  >
    <List.Item.Meta
      key={user.id}
      avatar={<UserAvatar user={user} />}
      title={user.fullName}
      description={user.nickname}
    />
    {content}
  </List.Item>
)

AddMemberListItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    fullName: PropTypes.string,
    nickname: PropTypes.string,
  }).isRequired,
  actionText: PropTypes.string.isRequired,
  onActionClick: PropTypes.func.isRequired,
  content: PropTypes.node,
  danger: PropTypes.bool,
}

AddMemberListItem.defaultProps = { danger: false, content: null }

export default AddMemberListItem
