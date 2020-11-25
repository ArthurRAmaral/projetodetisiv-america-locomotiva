import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Card, Skeleton, Col, Row, message, Typography, Button } from 'antd'
import { connect } from 'react-redux'
import * as teamStore from '../../store/ducks/team'

import EditTeamForm from '../../components/forms/EditTeamForm'
import NotFound from '../NotFound'
import TeamAvatar from '../../components/times/TeamAvatar'
import TeamPictureUploadModal from '../../components/times/TeamPictureUploadModal'

const { Paragraph, Title } = Typography

class TeamEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      uploadVisible: false,
    }
  }

  componentDidMount = async () => {
    const { match, fetchTeam } = this.props
    const { params } = match
    const { id } = params
    document.title = 'Times - Motorman'

    try {
      await fetchTeam(id)
    } catch (error) {
      // not found
    }

    this.setState({ loading: false })
  }

  handleSubmit = async data => {
    const { team, updateTeam, history } = this.props
    const payload = { id: team.id, ...data }

    const key = 'loadingMessage'

    try {
      message.loading({ content: 'Aguarde...', key })
      await updateTeam(payload)
      message.success({ content: 'Time atualizado com sucesso!', key })
      history.push('/app/team')
    } catch (error) {
      message.error({
        content: 'Ocorreu um erro. Por favor, revise os dados e tente novamente.',
        key,
      })
    }
  }

  render() {
    const { loading } = this.state
    const { team } = this.props

    if (loading) {
      return (
        <Card>
          <Skeleton active avatar paragraph={3} />
        </Card>
      )
    }

    if (team) {
      const { uploadVisible } = this.state
      return (
        <Card>
          <div className="text-center mb-lg">
            <Title>Editar time</Title>
            <Paragraph>Preencha o formulário abaixo para editar as informações do time</Paragraph>
          </div>
          <Row>
            <Col span={24}>
              <Row justify="center" className="mb-md">
                <Col flex>
                  <TeamAvatar team={team} size={120} />
                </Col>
              </Row>
              <Row justify="center">
                <Col flex>
                  <Button
                    size="small"
                    type="default"
                    onClick={() => this.setState({ uploadVisible: true })}
                  >
                    Mudar foto
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <EditTeamForm team={team} onSubmit={this.handleSubmit} />
            </Col>
          </Row>
          <TeamPictureUploadModal
            visible={uploadVisible}
            onCancel={() => this.setState({ uploadVisible: false })}
          />
        </Card>
      )
    }

    return <NotFound />
  }
}

TeamEdit.propTypes = {
  fetchTeam: PropTypes.func.isRequired,
  updateTeam: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  team: PropTypes.shape({
    id: PropTypes.number,
  }),
}

TeamEdit.defaultProps = {
  team: null,
}

const mapStateToProps = state => ({
  team: state.team,
})

const mapDispatchToProps = {
  updateTeam: teamStore.updateTeam,
  fetchTeam: teamStore.fetchTeam,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TeamEdit))
