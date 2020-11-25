/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect, useRef } from 'react'
import { Table, Input, Button, Popconfirm, Form } from 'antd'
import { connect } from 'react-redux'

import moment from 'moment'
import * as userStore from '../../store/ducks/user'

const EditableContext = React.createContext()

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  userId,
  createUserAnnotation,
  updateUserAnnotation,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const [initialValue, setInitialValue] = useState(children[1])

  const form = useContext(EditableContext)
  const inputRef = useRef()

  useEffect(() => {
    if (editing) {
      setInitialValue(inputRef.current.props.value)
      inputRef.current.focus()
    }
  }, [editing])

  const escFunction = event => {
    if (event.keyCode === 27) {
      inputRef.current.blur()
      form.setFieldsValue({ annotation: initialValue })
    }
  }

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    })
  }

  const save = async e => {
    try {
      const values = await form.validateFields()

      if (!record.previousExits) await createUserAnnotation({ ...values, userId })
      else await updateUserAnnotation({ ...values, userId, id: record.id })

      record.previousExits = true

      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `Uma anotação é necessária`,
          },
        ]}
      >
        <Input.TextArea ref={inputRef} onBlur={save} onKeyDown={escFunction} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props)

    this.columns = [
      {
        title: 'Anotação',
        dataIndex: 'annotation',
        editable: true,
      },
      {
        title: 'Criação',
        dataIndex: 'created_at',
      },
      {
        title: 'Atualização',
        dataIndex: 'updated_at',
      },
      {
        title: '',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="Realmente deseja deletar?"
              onConfirm={() => this.handleDelete(record.key, record.id)}
              okButtonProps={{ danger: true }}
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          ) : null,
      },
    ]
    const { user } = this.props
    this.state = {
      dataSource: user.annotations.map(u => ({ ...u, previousExits: true, key: u.annotation })),
      count: user.annotations.length,
    }
  }

  handleDelete = async (key, id) => {
    const { removeUserAnnotation, user } = this.props
    try {
      await removeUserAnnotation({ userId: user.id, id })

      const dataSource = [...this.state.dataSource]
      this.setState({
        dataSource: dataSource.filter(item => item.key !== key),
      })
    } catch (error) {
      console.log(error)
    }
  }

  handleAdd = () => {
    const { count, dataSource } = this.state

    const today = moment().format('L')

    const newData = {
      key: count,
      annotation: 'Edite este campo para salvar',
      created_at: today,
      updated_at: today,
    }
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    })
  }

  handleSave = row => {
    const newData = [...this.state.dataSource]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, { ...item, ...row })
    this.setState({
      dataSource: newData,
    })
  }

  render() {
    const { dataSource } = this.state
    const { user, createUserAnnotation, updateUserAnnotation } = this.props

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    }
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col
      }

      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          userId: user.id,
          createUserAnnotation,
          updateUserAnnotation,
        }),
      }
    })
    return (
      <>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          Add a row
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          style={{ width: '100%' }}
        />
      </>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = {
  createUserAnnotation: userStore.createUserAnnotation,
  updateUserAnnotation: userStore.updateUserAnnotation,
  removeUserAnnotation: userStore.removeUserAnnotation,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditableTable)
