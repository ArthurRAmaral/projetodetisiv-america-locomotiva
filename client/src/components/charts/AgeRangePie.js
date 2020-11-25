import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import { connect } from 'react-redux'
import { message } from 'antd'
import moment from 'moment'

import * as userAgeRangeStore from '../../store/ducks/userAgeRange'

const AgeRangePie = ({ usersList, fetchUsers }) => {

    const [ageRangeData, setAgeRangeData] = useState();

    const hasUserList = () => usersList.length > 0

    useEffect(() => {
        async function fetchData() {
            try {
                await fetchUsers()
            } catch (error) {
                message.error('Erro ao buscar os usuários. Tente recarregar a página.')
            }
        }

        if (!hasUserList()) {
            fetchData()
        }

        if (!ageRangeData && hasUserList()) {
            createUserData()
        }

    })

    const createUserData = () => {
        let auxRangeList = []
        let ageList = []
        let now = moment()
        ageList = usersList.map((user) => {
            let birth = moment(user.dob)
            if ((birth.month() < now.month()) || (birth.month() === now.month() && birth.day() >= now.day())) {
                return (now.year() - moment(user.dob).year())
            } else {
                return (now.year() - moment(user.dob).year()) - 1
            }
        })
        for (const age of ageList) {
            if (age > 0) {
                auxRangeList.push({
                    category: Math.floor(age / 5) * 5
                })
            }
        }
        auxRangeList.sort((a, b) => {
            if (a.category > b.category) {
                return 1
            } else if (a.category < b.category) {
                return -1
            } else {
                return 0
            }
        })
        auxRangeList.push(0)

        let agePieList = []
        let categoryAux = -1
        let valueAux = 0
        for (const age of auxRangeList) {
            if (age.category === categoryAux) {
                valueAux++
            } else {
                agePieList.push({
                    type: `${categoryAux} - ${categoryAux + 4}`,
                    value: valueAux
                })
                valueAux = 1
                categoryAux = age.category
            }
        }

        agePieList.splice(0, 1)



        setAgeRangeData([...agePieList])

    }

    const config = {
        forceFit: true,
        title: {
            visible: false,
            text: 'Fixa etária de integrantes do clube',
        },
        description: {
            visible: false,
            text:
                'Demonsta a faixa etária do integrantes do clube divididos de 5 em 5 anos',
        },
        padding: 'auto',
        data: ageRangeData ? ageRangeData : [],
        yField: 'value',
        xField: 'type',
        color: '#00843D',
        meta: {
            value: { alias: 'Pessoas na faixa' },
            type: { alias: 'Idade' }
        },
        label: {
            visible: true,
            position: 'middle',
            adjustColor: true,
        },
    };



    return (
        <Column {...config} style={{ width: "100%" }} />
    )
}

const mapStateToProps = state => ({
    usersList: state.userAgeRange
})

const mapDispatchToProps = {
    fetchUsers: userAgeRangeStore.fetchUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(AgeRangePie)