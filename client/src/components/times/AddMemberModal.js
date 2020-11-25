import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, message } from 'antd'
import { UsergroupAddOutlined } from '@ant-design/icons'
import AddMemberSelector from './AddMemberSelector'

class AddMemberModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      selected: [],
    }
  }

  showModal = () => this.setState({ visible: true })

  hideModal = () => this.setState({ visible: false })

  handleOk = () => {
    const { onOk } = this.props
    const { selected } = this.state
    if (selected.some(u => !u.groupId)) {
      message.warn(
        'Nem todos os membros selecionados possuem uma função. Defina uma função para cada membro selecionado.'
      )
      return
    }

    if (onOk(selected)) {
      this.setState({ selected: [] }, this.hideModal)
    }
  }

  handleChange = selected => this.setState({ selected })

  render() {
    const { visible } = this.state
    const { team, teamRoles } = this.props

    return (
      <>
        <Button type="primary" onClick={this.showModal} icon={<UsergroupAddOutlined />}>
          Adicionar membro
        </Button>
        <Modal
          width={1200}
          className="add-member-modal"
          title={`Adicionar membros à equipe ${team.name}`}
          okText="Adicionar todos"
          onOk={this.handleOk}
          onCancel={this.hideModal}
          visible={visible}
        >
          <AddMemberSelector teamRoles={teamRoles} team={team} onChange={this.handleChange} />
        </Modal>
      </>
    )
  }
}

AddMemberModal.propTypes = {
  team: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  teamRoles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  onOk: PropTypes.func.isRequired,
}

export default AddMemberModal
