import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Table,
  Button,
  Popconfirm,
  Tooltip,
  message,
  Space,
  Form,
  Input,
  Select,
  Timeline,
  Typography,
  DatePicker
} from 'antd'
import { EditOutlined } from '@ant-design/icons'
import * as moment from 'moment'
import * as userStore from '../../store/ducks/user'
import * as historicItemsStore from '../../store/ducks/historicItem'
import { fetchHistoricTypes } from '../../store/ducks/historicTypes'

import { formatDateTime } from '../../util/stringUtil'

const { Title, Paragraph } = Typography
const { RangePicker } = DatePicker
const dateFormat = 'DD/MM/YYYY'

class UserHistoricTable extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    isFetching: true,
    showCration: false,
    isCreating: false,
    initialValue: null,
    isEdit: false,
    showTable: false
  }

  CreateHistoricForm = ({ initialValue }) => {
    const { Option } = Select
    const [form] = Form.useForm()

    if (initialValue) form.resetFields()

    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 32 }
    }

    const tailLayout = {
      // wrapperCol: { offset: 8, span: 16 },
    }

    const onEditFinish = values => {
      this.setState({ isCreating: true })
      const msg = message.loading('Editando', 0)
      const { updateHistoricItem } = this.props
      updateHistoricItem({
        ...initialValue,
        start_at: values.rangePicker ? values.rangePicker[0] : null,
        end_at: values.rangePicker ? values.rangePicker[1] : null,
        ...values
      }).then(() => {
        this.setState({ isCreating: false, showCration: false })
        setTimeout(msg, 0)
        message.success('Editado com sucesso')
      })
      form.resetFields()
    }

    const onFinish = values => {
      this.setState({ isCreating: true })
      const msg = message.loading('Criando', 0)
      const { createHistoricItem } = this.props
      createHistoricItem({
        user_id: this.props.user.id,
        start_at: values.rangePicker ? values.rangePicker[0] : undefined,
        end_at: values.rangePicker ? values.rangePicker[1] : undefined,
        ...values
      }).then(() => {
        this.setState({ isCreating: false, showCration: false })
        setTimeout(msg, 0)
        message.success('Criado com sucesso')
      })
      form.resetFields()
    }

    const onFinishFailed = errorInfo => {
      message.error('Preencha todos os campos')
    }

    return (
      <Form
        {...layout}
        name="basic"
        form={form}
        initialValues={initialValue}
        onFinish={this.state.isEdit ? onEditFinish : onFinish}
        onFinishFailed={onFinishFailed}
        layout="inline"
      >
        <Form.Item
          name="title"
          rules={[{ required: true, message: 'Este campo é obrigatório!' }]}
        >
          <Input placeholder="Título" />
        </Form.Item>

        <Form.Item
          name="description"
          rules={[{ required: true, message: 'Este campo é obrigatório!' }]}
        >
          <Input.TextArea
            autoSize={{ minRows: 1, maxRows: 6 }}
            placeholder="Descrição"
          />
        </Form.Item>

        <Form.Item
          name="historic_type_id"
          rules={[{ required: true, message: 'Este campo é obrigatório!' }]}
        >
          <Select placeholder="Tipo">
            {this.props.historictypes.map(({ id, type }) => (
              <Option key={id} value={id}>
                {type}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Data" name="rangePicker">
          <RangePicker
            allowEmpty={[true, true]}
            format={dateFormat}
          ></RangePicker>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            loading={this.state.isCreating}
            type="primary"
            htmlType="submit"
          >
            Salvar
          </Button>
        </Form.Item>
      </Form>
    )
  }

  editClickHandler = data => {
    const state = {
      showCration: true,
      initialValue: {
        ...data,
        rangePicker: [
          data.start_at ? moment(data.start_at) : null,
          data.end_At ? moment(data.end_at) : null
        ]
      },
      isEdit: true
    }
    this.setState(state)
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    })
  }

  handleDelete = id => {
    const msg = message.loading('Deletando', 0)
    const { deleteHistoricItem } = this.props
    deleteHistoricItem(id).then(() => {
      setTimeout(msg, 0)
      message.success('Deletado com sucesso')
    })
  }

  handleCreate = () => {
    this.setState({
      showCration: !this.state.showCration,
      initialValue: null,
      isEdit: false
    })
  }

  componentDidMount = async () => {
    const { id, fetchHistoricItemsPerUser, fetchHistoricTypes } = this.props

    try {
      await fetchHistoricItemsPerUser(id)
      await fetchHistoricTypes()
      this.setState({ isFetching: false })
    } catch (error) {
      message.error(
        'Ocorreu um erro ao buscar os histórico do usuário. Você está conectado a internet?'
      )
    }
  }

  render() {
    let { sortedInfo, isFetching, showCration, showTable } = this.state
    const { historic, historictypes } = this.props
    sortedInfo = sortedInfo || {}
    // filteredInfo = filteredInfo || {};
    // let filterValues = data.map((elemet) => ({ text: elemet.title, value: elemet.title }));
    // filterValues = filterValues.filter(
    //   (elemet, indx) => filterValues.map((elemet) => elemet.title).indexOf(elemet.text) === indx
    // );

    const columns = [
      {
        title: 'Título',
        dataIndex: 'title',
        sorter: (a, b) => a.title.localeCompare(b.title),
        sortOrder: sortedInfo.field === 'title' && sortedInfo.order,
        align: 'center',
        render: (text, record) => (
          <Tooltip placement="bottomLeft" title={record.description}>
            {text}
          </Tooltip>
        )
      },
      {
        title: 'Tipo',
        dataIndex: 'historictype',
        filters: historictypes
          ? historictypes.map(element => ({
              text: element.type,
              value: element.id
            }))
          : [],

        onFilter: (value, record) => {
          return record.historictype.id === value
        },

        sorter: (a, b) =>
          a.historictype.type.localeCompare(b.historictype.type),

        sortOrder: sortedInfo.field === 'historictype' && sortedInfo.order,
        align: 'center',
        render: text => text.type
      },
      {
        title: 'Começo',
        dataIndex: 'start_at',
        //   sorter: (a, b) => {
        //     const { end_at_A } = a;
        //     const { end_at_B } = b;

        //     if (end_at_A && end_at_B) return end_at_A.localeCompare(end_at_B);
        //     else if (!end_at_A) return -1;
        //     else if (!end_at_B) return 1;
        //     else return 0;
        //   },
        //   sortOrder: sortedInfo.field === 'start_at' && sortedInfo.order,
        align: 'center',
        render: text => (text ? formatDateTime(text) : '-')
      },
      {
        title: 'Termino',
        dataIndex: 'end_at',
        // sorter: (a, b, x) => {
        //   const end_at_A = a.end_at;
        //   const end_at_B = b.end_at;

        //   console.log(end_at_A, end_at_B, x);

        //   if (!end_at_B && !end_at_A) return x === 'ascend' ? -1 : 1;
        //   else if (!end_at_B) return x === 'ascend' ? -1 : 1;
        //   else if (!end_at_A) return x === 'ascend' ? -1 : 1;
        //   else {
        //     const A = new Date(end_at_A);
        //     const B = new Date(end_at_B);

        //     console.log([B, A].sort());
        //     if (A < B) {
        //       console.log(x === 'ascend' ? -1 : 1);
        //       return x === 'ascend' ? -1 : 1;
        //     } else if (A > B) {
        //       console.log(x === 'ascend' ? 1 : -1);
        //       return x === 'ascend' ? 1 : -1;
        //     } else {
        //       console.log(0);
        //       return 0;
        //     }
        //   }
        // },
        // sortOrder: sortedInfo.field === 'end_at' && sortedInfo.order,
        align: 'center',
        render: text => (text ? formatDateTime(text) : '-')
      },
      {
        title: '',
        align: 'center',
        dataIndex: 'operationdelete',
        render: (text, record) => (
          <Popconfirm
            title="Realmente deseja deletar?"
            onConfirm={() => this.handleDelete(record.id)}
            okButtonProps={{ danger: true }}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        )
      },
      {
        align: 'center',
        title: '',
        dataIndex: 'operationedit',
        render: (text, record) => (
          <Tooltip title="Editar">
            <Button
              type="primary"
              onClick={() => this.editClickHandler(record)}
              shape="circle"
              icon={<EditOutlined />}
            />
          </Tooltip>
        )
      }
    ]

    return (
      <>
        <>
          <Space style={{ marginBottom: 16 }}>
            <Button type="primary" onClick={this.handleCreate}>
              Criar Novo
            </Button>
            {showCration ? (
              <this.CreateHistoricForm initialValue={this.state.initialValue} />
            ) : (
              <></>
            )}
          </Space>
        </>
        <Timeline pending={isFetching ? 'Carregando...' : ''} mode="left">
          {historic
            .sort((a, b) => {
              if (!a.start_at) return 1
              if (!b.start_at) return -1

              return moment(b.start_at) - moment(a.start_at)
            })
            .map(historic => {
              return (
                <Timeline.Item
                  key={historic.id}
                  color={historic.historictype.color}
                  label={<Title level={4}>{historic.title}</Title>}
                >
                  <div style={{ display: 'flex' }}>
                    <div
                      style={{
                        width: 'calc(100% - 200px)',
                        margin: '15px'
                      }}
                    >
                      <Tooltip
                        placement="topLeft"
                        title={historic.historictype.type}
                      >
                        <Paragraph type="secondary">
                          {historic.description}
                        </Paragraph>
                        <Paragraph type="secondary" strong>
                          {historic.start_at
                            ? `Data de início: ${moment(
                                historic.start_at
                              ).format(dateFormat)}`
                            : null}
                        </Paragraph>
                        <Paragraph type="secondary" strong>
                          {historic.end_at
                            ? `Data de Término: ${moment(
                                historic.end_at
                              ).format(dateFormat)}`
                            : null}
                        </Paragraph>
                      </Tooltip>
                    </div>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Popconfirm
                        title="Realmente deseja deletar?"
                        onConfirm={() => this.handleDelete(historic.id)}
                        okButtonProps={{ danger: true }}
                      >
                        <Button style={{ marginRight: '15px' }} danger>
                          Delete
                        </Button>
                      </Popconfirm>

                      <Tooltip placement="right" title="Editar">
                        <Button
                          type="primary"
                          onClick={() => this.editClickHandler(historic)}
                          shape="circle"
                          icon={<EditOutlined />}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </Timeline.Item>
              )
            })}
        </Timeline>

        <Button
          type="primary"
          onClick={() => this.setState({ showTable: !showTable })}
        >
          {showTable ? 'Esconder Tabela' : 'Mostrar Tabela'}
        </Button>

        {showTable ? (
          <Table
            key={1}
            columns={columns}
            loading={isFetching}
            dataSource={historic}
            onChange={this.handleChange}
            size="small"
          />
        ) : null}
      </>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  historic: state.historicItems,
  historictypes: state.historicTypes
})

const mapDispatchToProps = {
  fetchUser: userStore.fetchUser,
  fetchHistoricItemsPerUser: historicItemsStore.fetchHistoricItemsPerUser,
  createHistoricItem: historicItemsStore.createHistoricItem,
  updateHistoricItem: historicItemsStore.updateHistoricItem,
  deleteHistoricItem: historicItemsStore.deleteHistoricItem,
  fetchHistoricTypes
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UserHistoricTable))
