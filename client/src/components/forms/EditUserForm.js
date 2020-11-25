import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Row, Col, Typography, Button, Select, Radio } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import PhoneInput from '../masked-inputs/PhoneInput'
import CPFInput from '../masked-inputs/CPFInput'
import DecimalInput from '../masked-inputs/DecimalInput'
import DateInput from '../masked-inputs/DateInput'
import IntegerInput from '../masked-inputs/IntegerInput'
import CepSearchInput from '../CepSearchInput'
import { parseNumber } from '../../util/numberUtil'
import rules from './rules'

const { Title } = Typography

function EditUserForm({ user, plans, groups, conditions, onSubmit }) {
  const [form] = Form.useForm()

  // eslint-disable-next-line
  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
  }

  const initialValues = user
    ? {
      ...user,
      birth: user.dob ? new Date(user.dob).addHours(3).toLocaleDateString('pt-br') : '',
      weightNumberFormat: parseNumber(user.weight) || null,
      buildingNumber: parseNumber(user.buildingNumber) || null,
    }
    : {
      group_id: 3,
      condition_id: 1,
      plan_id: 1
    }

  const handleFinish = values => {
    const { birth, cpf, cep, weightNumberFormat, buildingNumber, height } = values
    const date = birth ? birth.split('/') : []
    const [day, month, year] = date
    const dob = date.length === 3 ? [year, month, day].join('-') : null

    const payload = {
      ...values,
      dob,
      cpf: cpf ? cpf.replace(/\D/g, '') : null,
      cep: cep ? cep.replace(/\D/g, '') : null,
      weight: parseNumber(weightNumberFormat) || null,
      buildingNumber: parseNumber(buildingNumber) || null,
      height: parseNumber(height) || null,
    }

    onSubmit(payload)
  }

  const handleCepResult = data => {
    form.setFieldsValue({
      state: data.uf,
      city: data.cidade,
      street: data.logradouro,
      neighborhood: data.bairro,
    })
  }

  return (
    <Row>
      <Col xs={24}>
        <Form
          layout="vertical"
          name="user"
          form={form}
          onFinish={handleFinish}
          initialValues={initialValues}
          scrollToFirstError
        >
          <Row className="pt-lg">
            <Col>
              <Title level={4}>Contato</Title>
            </Col>
          </Row>

          <Form.Item required name="fullName" label="Nome completo:" rules={[rules.required]}>
            <Input type="text" />
          </Form.Item>
          <Form.Item required name="email" label="E-mail:" rules={[rules.email, rules.required]}>
            <Input placeholder="email@exemplo.com" disabled={user && user.email} />
          </Form.Item>
          <Form.Item required name="phone" label="Telefone:" rules={[rules.required]}>
            <PhoneInput />
          </Form.Item>

          {conditions && (
            <>
              <Row className="pt-lg">
                <Col>
                  <Title level={4} color="#000000">
                    Condição
                  </Title>
                </Col>
              </Row>
              <Form.Item name="condition_id" label="Condição atual do usuário">
                <Select>
                  {conditions.map(condition => (
                    <Select.Option key={condition.id} value={condition.id}>
                      {condition.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {groups && (
            <>
              <Row className="pt-lg">
                <Col>
                  <Title level={4}>Sistema</Title>
                </Col>
              </Row>
              <Form.Item name="group_id" label="Tipo de usuário">
                <Select>
                  {groups.map(group => (
                    <Select.Option key={group.id} value={group.id}>
                      {group.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {plans && (
            <>
              <Row className="pt-lg">
                <Col>
                  <Title level={4}>Plano</Title>
                </Col>
              </Row>

              <Form.Item name="plan_id" label="Plano de pagamento">
                <Select>
                  {plans.map(plan => (
                    <Select.Option key={plan.id} value={plan.id}>
                      {plan.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          <Row className="pt-lg">
            <Col>
              <Title level={4}>Informações pessoais</Title>
            </Col>
          </Row>

          <Form.Item required name="sex" label="Sexo:" rules={[rules.required]}>
            <Radio.Group>
              <Radio value="Masculino">Masculino</Radio>
              <Radio value="Feminino">Feminino</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="nickname" label="Apelido:">
            <Input />
          </Form.Item>
          <Form.Item name="rg" label="RG:">
            <Input placeholder="Apenas números" />
          </Form.Item>
          <Form.Item name="cpf" label="CPF:">
            <CPFInput />
          </Form.Item>
          <Form.Item name="weightNumberFormat" label="Peso (kg):">
            <DecimalInput />
          </Form.Item>
          <Form.Item name="height" label="Altura (cm):">
            <IntegerInput />
          </Form.Item>
          <Form.Item name="birth" label="Data de nascimento:">
            <DateInput />
          </Form.Item>
          <Form.Item name="healthInsurance" label="Plano de saúde (se houver):">
            <Input />
          </Form.Item>

          <Row className="pt-lg">
            <Col>
              <Title level={4}>Endereço</Title>
            </Col>
          </Row>

          <Form.Item name="cep" label="CEP:">
            <CepSearchInput onSearchResult={handleCepResult} />
          </Form.Item>
          <Form.Item name="state" label="Estado:">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="Cidade:">
            <Input />
          </Form.Item>
          <Form.Item name="neighborhood" label="Bairro:">
            <Input />
          </Form.Item>
          <Form.Item name="street" label="Endereço:">
            <Input />
          </Form.Item>
          <Form.Item name="buildingNumber" label="Número:">
            <IntegerInput />
          </Form.Item>
          <Form.Item name="complement" label="Complemento:">
            <Input />
          </Form.Item>

          <Row className="pt-lg">
            <Col>
              <Title level={4}>Responsável/Contato de emergência</Title>
            </Col>
          </Row>

          <Form.Item name="emergencyName" label="Nome do responsável:">
            <Input />
          </Form.Item>
          <Form.Item name="emergencyEmail" label="E-mail do responsável:" rules={[rules.email]}>
            <Input />
          </Form.Item>
          <Form.Item name="emergencyPhone" label="Telefone do responsável:">
            <PhoneInput />
          </Form.Item>
          <Form.Item name="emergencyConsanguinity" label="Grau de parentesco:">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

EditUserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
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
  }),
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ),
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ),
  conditions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ),
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
}

EditUserForm.defaultProps = {
  user: null,
  groups: null,
  plans: null,
  conditions: null,
  currentUser: null,
}

export default EditUserForm
