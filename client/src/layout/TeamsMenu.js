/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import { TeamOutlined } from '@ant-design/icons'

function TeamMenuItem({ team, ...props }) {
  const basePath = `/app/team/${team.id}`
  return (
    <Menu.SubMenu {...props} key={basePath} title={team.name} icon={<TeamOutlined />}>
      <Menu.Item key={`${basePath}/members`}>
        <Link to={`${basePath}/members`}>Membros da equipe</Link>
      </Menu.Item>
      <Menu.Item key={`${basePath}/trainings`}>
        <Link to={`${basePath}/trainings`}>Treinos</Link>
      </Menu.Item>
      <Menu.Item key={`${basePath}/events`}>
        <Link to={`${basePath}/events`}>Eventos</Link>
      </Menu.Item>
    </Menu.SubMenu>
  )
}

TeamMenuItem.propTypes = {
  team: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
}

function TeamsMenu({ currentUser, ...props }) {
  if (currentUser.roles) {
    const teams = currentUser.roles.map(r => r.team)
    // const teams = [{ id: 1, name: 'time 1' }]
    return teams.map(team => <TeamMenuItem key={team} team={team} {...props} />)
  }
  return null
}

TeamsMenu.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.array.isRequired,
  }).isRequired,
}

export default TeamsMenu
