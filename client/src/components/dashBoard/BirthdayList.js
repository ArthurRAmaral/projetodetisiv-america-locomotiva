import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { message, List, Badge, Card, Typography, Avatar, Collapse, Spin } from 'antd'
import * as BirthdayStore from '../../store/ducks/birthdayUsers'

const BirthdayList = ({ birthdayUsers, fetchBirthday }) => {
    const [listMonth, setlistMonth] = useState()
    const [listToday, setListToday] = useState()

    const { Panel } = Collapse;

    const hasBirthdayUsers = () => birthdayUsers.hasOwnProperty('birthday')

    useEffect(() => {
        async function fetchData() {
            try {
                await fetchBirthday()
            } catch (error) {
                message.error('Erro ao buscar os usuários. Tente recarregar a página.')
            }
        }

        if (!hasBirthdayUsers()) {
            fetchData()
        }

        if (!listMonth && hasBirthdayUsers()) {
            createListMonth()
        }

        if (!listToday && hasBirthdayUsers()) {
            createListToday()
        }

    })

    const createListMonth = () => {
        setlistMonth([...birthdayUsers.birthday.month])
    }

    const createListToday = () => {
        setListToday([...birthdayUsers.birthday.today])
    }

    // eslint-disable-next-line
    Date.prototype.addHours = function (h) {
        this.setTime(this.getTime() + (h * 60 * 60 * 1000));
        return this;
    }

    const PAST = 'success'
    const FUTURE = 'error'

    const dateStatus = (date) => {
        const userDob = new Date(date)
        const today = new Date()
        const birthday = new Date(today.getFullYear(), userDob.getMonth(), userDob.getDate())
        return birthday > today ? PAST : FUTURE
    }

    const customizeDate = (date) => {

        const birthdayDate = new Date(date)

        birthdayDate.addHours(3)
        return birthdayDate.toLocaleDateString()
    }

    const sortByDay = (users) => {
        const newUsers = [...users]
        const DEFAULT_YEAR = 2000
        newUsers.sort((a, b) => {
            const pureA = new Date(a.dob)
            const pureB = new Date(b.dob)
            const dateA = new Date(DEFAULT_YEAR, pureA.getMonth(), pureA.getDate())
            const dateB = new Date(DEFAULT_YEAR, pureB.getMonth(), pureB.getDate())
            return dateA - dateB;
        })
        return newUsers
    }

    return (
        listToday && listMonth ?
            <>
                <Card title="Aniversariantes do dia" style={{ width: 300 }}>
                    {listToday.length > 0 ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={listToday}
                            renderItem={user => (
                                <Link to={`/app/user/${user.id}`} key={`${user.id}-user`}>
                                    <List.Item >
                                        <List.Item.Meta
                                            avatar={<Avatar src={user.avatar} />}
                                            title={user.fullName}
                                            description={customizeDate(user.dob)}
                                        />
                                    </List.Item>
                                </Link>
                            )}
                        />
                    ) : (
                            <Typography.Text strong> Sem aniversariantes hoje </Typography.Text>
                        )}
                </Card>
                {listMonth.length > 0 ?
                    <Collapse
                        style={{ width: 300 }}
                    // onChange={callback}
                    // expandIconPosition={expandIconPosition}
                    >
                        <Panel header="Aniversariantes do mês" key="1" >
                            <List
                                itemLayout="horizontal"
                                dataSource={sortByDay(listMonth)}
                                renderItem={user => (
                                    <Link to={`/app/user/${user.id}`} >
                                        <List.Item key={`${user.id}-user`}>
                                            <List.Item.Meta
                                                avatar={<Avatar src={user.avatar} />}
                                                title={user.fullName}
                                                description={customizeDate(user.dob)}
                                            />
                                            <Badge status={dateStatus(user.dob)} />
                                        </List.Item>
                                    </Link>
                                )}
                            />
                        </Panel>
                    </Collapse> : (
                        <Card title="Sem aniversarientes nesse mês" style={{ width: 300 }}>
                        </Card>
                    )}
            </> : <Card title="Carregando aniversários" style={{ width: 300 }}>
                <Spin />
            </Card>
    )
}

const mapStateToProps = state => ({
    birthdayUsers: state.birthdayUsers,
})

const mapDispatchToProps = {
    fetchBirthday: BirthdayStore.fetchBirthday,
}

export default connect(mapStateToProps, mapDispatchToProps)(BirthdayList)
