import React from 'react'
import { Table,Tag } from 'antd'
import Column from 'antd/lib/table/Column'
import {Link} from 'react-router-dom'

import moment from 'moment'




const UserFrequenceTable = (props) => {
    const logs = props.user.logs.sort((a,b) => {
        if (a.end_date >= b.end_date) {
            return 1;
          }
          if (a.end_date < b.end_date) {
            return -1;
          }
          return 0;
    })
    return (
        <Table
        scroll={{ x: 'auto' }}
        rowKey="id"
        size="small"
        dataSource={logs}
        > 

      <Column
        title="Nome"
        dataIndex="Name"
        render={(value, record) => ( moment(record.end_date).valueOf() >= moment().valueOf() ? <Link to={`/app/event/${record.id}`}>{record.name}</Link> : <p>{record.name}</p>)}
      />

      <Column
        title="Tipo"
        dataIndex="logType"
        render={(value, record) => <p>{record.logType.name}</p>}
      />

      <Column
        title="Data de Inicio"
        dataIndex="start_date"
        render={(value, record) => <p>{moment(record.start_date).format('DD/MM/YYYY HH:mm')}</p>}
      />

      <Column
        title="Data de Termino"
        dataIndex="end_date"
        render={(value, record) => <p>{moment(record.end_date).format('DD/MM/YYYY HH:mm')}</p>}
      />

      <Column
        title="status"
        dataIndex="presence"
        render={(value, record) => record.pivot.presence ? <Tag color={"green"}>Presente</Tag> : <Tag color={"volcano"}>Ausente</Tag>}
      />
      

      </Table>
    )
}

export default UserFrequenceTable