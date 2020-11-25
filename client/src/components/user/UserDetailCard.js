import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Skeleton, Typography, Row, Col, Tag } from 'antd'

import { formatUserAddress } from '../../util/stringUtil'

import RemoveUserButton from './RemoveUserButton'
import EditUserButton from './EditUserButton'
import UserNotesButton from './UserNotesButton'
import UserAnnotationTable from './UserAnnotationTable'
import UserHistoricTable from './UserHistoricTable'
import UserAvatar from './UserAvatar'
import PhoneMask from '../masked/PhoneMask'
import CPFMask from '../masked/CPFMask'
import DecimalMask from '../masked/DecimalMask'
import IntegerMask from '../masked/IntegerMask'
import RestoreUserButton from './RestoreUserButton'
import AccessControl from '../AccessControl'
import StatusTag from '../StatusTag'
import ConditionTag from './ConditionTag'
import UserFrequenceTable from './UserFrequenceTable'
import UserTuitionTable from './UserTuitionTable'

const { Title, Text, Paragraph } = Typography

const UserField = ({ label, value }) => (
  <>
    <Col xs={12} md={4}>
      <Text type="secondary">{label}</Text>
    </Col>
    <Col xs={12} md={20}>
      <Paragraph>{value}</Paragraph>
    </Col>
  </>
)

UserField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node
}

UserField.defaultProps = {
  value: null
}

function UserDetailCard({ user, showAnnotation, showHistoric, showPresenceFrequence, showTutionTable }) {
  const [showUserAnnotation, setshowUserAnnotation] = useState(showAnnotation || false)
  const [shouldShowHistoricContent, setshowUserHistoric] = useState(showHistoric || false)
  const [shouldShowPresenceFrequence, setshowUserPresenceFrequence] = useState(showPresenceFrequence || false)
  const [shouldShowTutionTable, setshowUserTutionTable] = useState(showTutionTable || false)



  const showAnnotationButton = () => {
    setshowUserAnnotation(!showUserAnnotation)
    setshowUserHistoric(false)
    setshowUserPresenceFrequence(false)
    setshowUserTutionTable(false)
  }

  const showHistoricButtonFunc = () => {
    setshowUserHistoric(!shouldShowHistoricContent)
    setshowUserAnnotation(false)
    setshowUserPresenceFrequence(false)
    setshowUserTutionTable(false)
  }

  const showPresenceFrequenceButtonFunc = () => {
    setshowUserPresenceFrequence(!shouldShowPresenceFrequence)
    setshowUserAnnotation(false)
    setshowUserHistoric(false)
    setshowUserTutionTable(false)
  }

  const showTutionButtonFunc = () => {
    setshowUserTutionTable(!shouldShowTutionTable)
    setshowUserPresenceFrequence(false)
    setshowUserAnnotation(false)
    setshowUserHistoric(false)
  }

  // eslint-disable-next-line
  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
  }

  return user ? (
    <Row>
      <Col xs={24} xl={4} className="mr-lg">
        <Row className="mb-sm">
          <Col>
            <ConditionTag entity={user} />
          </Col>
        </Row>
        <Row justify="center" className="mb-sm">
          <Col>
            <UserAvatar user={user} size={120} />
          </Col>
        </Row>
        <AccessControl permission="application/users/manage">
          <Row justify="center" className="mb-md">
            {user.group && (
              <Col>
                <Tag>{user.group.title}</Tag>
              </Col>
            )}
            <Col>
              <StatusTag entity={user} />
            </Col>
          </Row>
          {user.plan && (
            <Row justify="center" className="mb-md">
              <Col>
                <Paragraph>
                  <Text strong>Plano:</Text> {user.plan.name}
                </Paragraph>
              </Col>
            </Row>
          )}
          <Row className="mb-sm">
            <Col>
              {user.active && <RemoveUserButton user={user} />}
              {!user.active && <RestoreUserButton user={user} />}
            </Col>
            <Col>
              <EditUserButton id={user.id} />
            </Col>
            <Col>
              <UserNotesButton
                innitialText="Anotações"
                onClick={showAnnotationButton}
                shouldShowContent={showUserAnnotation}
              />
            </Col>
            <Col>
              <UserNotesButton
                innitialText="Históricos Gerais"
                onClick={showHistoricButtonFunc}
                shouldShowContent={shouldShowHistoricContent}
              />
            </Col>
            <Col>
              <UserNotesButton
                innitialText="Histórico Frequencia"
                onClick={showPresenceFrequenceButtonFunc}
                shouldShowContent={shouldShowPresenceFrequence}
              />
            </Col>
            <Col>
              <UserNotesButton
                innitialText="Histórico Mensalidades"
                onClick={showTutionButtonFunc}
                shouldShowContent={shouldShowTutionTable}
              />
            </Col>
          </Row>
        </AccessControl>
      </Col>
      {showUserAnnotation ? (
        <Col xs={24} xl={18}>
          <UserAnnotationTable />
        </Col>
      ) : shouldShowHistoricContent ? (
        <Col xs={24} xl={18}>
          <UserHistoricTable id={user.id} />
        </Col>
      ) : shouldShowPresenceFrequence ? (
        <Col xs={24} xl={18}>
          <UserFrequenceTable user={user} />
        </Col>
      ) : shouldShowTutionTable ? (
        <Col xs={24} xl={18}>
          <UserTuitionTable user={user} />
        </Col>
      ) : (
                <Col xs={24} xl={18}>
                  <Row className="mb-lg">
                    <Col>
                      <Title level={2}>{user.fullName}</Title>
                    </Col>
                  </Row>

                  <Row className="mb-lg">
                    <Col xs={24}>
                      <Title level={4}>Contato</Title>
                    </Col>

                    <UserField label="E-mail:" value={user.email} />
                    <UserField
                      label="Telefone:"
                      value={<PhoneMask value={user.phone} />}
                    />
                    <UserField label="Endereço:" value={formatUserAddress(user)} />

                    {// Dados do responsável
                      user.emergencyName && (
                        <>
                          <UserField
                            label="Nome do responsável:"
                            value={
                              <>
                                {user.emergencyName}
                                <Text style={{ fontSize: '80%' }} type="secondary">
                                  {` (${user.emergencyConsanguinity})`}
                                </Text>
                              </>
                            }
                          />

                          <UserField
                            label="Telefone do responsável:"
                            value={<PhoneMask value={user.emergencyPhone} />}
                          />
                          <UserField
                            label="E-mail do responsável:"
                            value={user.emergencyEmail}
                          />
                        </>
                      )}
                  </Row>

                  <Row className="mb-lg">
                    <Col xs={24}>
                      <Title level={4}>Informações pessoais</Title>
                    </Col>

                    <UserField label="Apelido:" value={user.nickname} />
                    <UserField label="RG:" value={user.rg} />
                    <UserField label="CPF:" value={<CPFMask value={user.cpf} />} />
                    <UserField
                      label="Data de Nascimento:"
                      value={new Date(user.dob).addHours(3).toLocaleDateString('pt-br')}
                    />
                    <UserField label="Sexo:" value={user.sex} />

                    <UserField
                      label="Peso:"
                      value={
                        <DecimalMask
                          value={user.weight}
                          renderText={value => (value ? `${value} kg` : '')}
                        />
                      }
                    />

                    <UserField
                      label="Altura:"
                      value={
                        <IntegerMask
                          value={user.height}
                          renderText={value => (value ? `${value} cm` : '')}
                        />
                      }
                    />

                    <UserField label="Plano de saúde:" value={user.healthInsurance} />
                  </Row>
                </Col>
              )}
    </Row>
  ) : (
      <Skeleton avatar paragraph={{ rows: 2 }} active />
    )
}
UserDetailCard.defaultProps = {
  showAnnotation: false,
  showHistoric: false,
  showPresenceFrequence: false,
}

UserDetailCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string,
    fullName: PropTypes.string,
    nickname: PropTypes.string,
    phone: PropTypes.string,
    rg: PropTypes.string,
    cpf: PropTypes.string,
    cep: PropTypes.string,
    state: PropTypes.string,
    city: PropTypes.string,
    neighborhood: PropTypes.string,
    street: PropTypes.string,
    buildingNumber: PropTypes.number,
    complement: PropTypes.string,
    weight: PropTypes.number,
    height: PropTypes.number,
    dob: PropTypes.string,
    emergencyName: PropTypes.string,
    emergencyEmail: PropTypes.string,
    emergencyPhone: PropTypes.string,
    emergencyConsanguinity: PropTypes.string,
    healthInsurance: PropTypes.string,
    sex: PropTypes.string,
    active: PropTypes.bool,
    annotations: PropTypes.array,
    plan: PropTypes.shape({
      name: PropTypes.string
    }),
    group: PropTypes.shape({
      title: PropTypes.string
    })
  }).isRequired,
  showAnnotation: PropTypes.bool,
  showHistoric: PropTypes.bool,
  showPresenceFrequence: PropTypes.bool,
}

export default UserDetailCard
