import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Descriptions, Typography, Space } from 'antd'

import { formatUserAddress } from '../../util/stringUtil'
import PhoneMask from '../masked/PhoneMask'
import DecimalMask from '../masked/DecimalMask'
import CPFMask from '../masked/CPFMask'
import IntegerMask from '../masked/IntegerMask'

const { Text } = Typography
const { Item } = Descriptions

function UserDescription({ user }) {

  // eslint-disable-next-line
  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
  }

  const birthday = moment(new Date(user.dob).addHours(3))
  const diff = moment(Date.now()).diff(birthday)
  const yearsOld = Math.floor(moment.duration(diff).asYears())

  return (
    <Space direction="vertical" size="middle">
      <Descriptions title="Contato">
        <Item label="Nome completo">{user.fullName}</Item>
        <Item label="E-mail">{user.email}</Item>
        <Item label="Telefone">
          <PhoneMask value={user.phone} />
        </Item>
        <Item label="Endereço">{formatUserAddress(user)}</Item>
      </Descriptions>
      {// Dados do responsável
        user.emergencyName && (
          <Descriptions title="Contato de emergência/Responsável">
            <Item label="Nome">
              <Text>{user.emergencyName}</Text>
              {user.emergencyConsanguinity && (
                <Text type="secondary">{` (${user.emergencyConsanguinity})`}</Text>
              )}
            </Item>
            <Item label="Telefone">
              <PhoneMask value={user.emergencyPhone} />
            </Item>
            <Item label="E-mail">{user.emergencyEmail}</Item>
          </Descriptions>
        )}

      <Descriptions title="Informações pessoais">
        <Item label="Apelido">{user.nickname}</Item>
        <Item label="RG">{user.rg}</Item>
        <Item label="CPF">
          <CPFMask value={user.cpf} />
        </Item>
        <Item label="Data de Nascimento">
          {user.dob && birthday.format('DD/MM/YYYY')}
          &nbsp;({yearsOld} anos)
        </Item>
        <Item label="Sexo">{user.sex}</Item>
        <Item label="Peso">
          <DecimalMask value={user.weight} renderText={value => (value ? `${value} kg` : '')} />
        </Item>
        <Item label="Altura">
          <IntegerMask value={user.height} renderText={value => (value ? `${value} cm` : '')} />
        </Item>
        <Item label="Plano de saúde">{user.healthInsurance}</Item>
      </Descriptions>
    </Space>
  )
}

UserDescription.propTypes = {
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
      name: PropTypes.string,
    }),
    group: PropTypes.shape({
      title: PropTypes.string,
    }),
  }).isRequired,
}

export default UserDescription
