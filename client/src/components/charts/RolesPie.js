import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import { connect } from 'react-redux'
import { message } from 'antd'

import * as RolesStore from '../../store/ducks/userRoles'

const RolesPie = ({ userRoles, fetchRoles, team }) => {

    const [userData, setUserData] = useState()

    const noRole = "Sem função"

    const hasUserRolesList = () => userRoles.length > 0

    useEffect(() => {
        async function fetchData() {
            try {
                await fetchRoles()
            } catch (error) {
                message.error('Erro ao buscar os usuários. Tente recarregar a página.')
            }
        }

        if (!hasUserRolesList()) {
            fetchData()
        }

        if (!userData && hasUserRolesList()) {
            createUserData()
        }

    })

    const createUserData = () => {
        const roles = []
        let index = -1
        let i = 0
        for (let user of userRoles) {
            if (!team && user.roles.length === 0) {
                if (index === -1) {
                    index = i;
                    roles.push({ type: noRole, value: 1 })
                } else {
                    roles[index].value++
                }
            } else {
                for (let j = 0; j < user.roles.length; j++) {
                    if (team && user.roles[j].team.name !== team) {
                        continue
                    }

                    const roleTitle = user.roles[j].role.title
                    let exists = -1

                    for (let k = 0; k < roles.length; k++) {
                        if (roles[k].type === roleTitle) {
                            exists = k;
                            break;
                        }
                    }

                    if (exists === -1) {
                        roles.push({ type: user.roles[j].role.title, value: 1 })
                    }
                    else {
                        roles[exists].value++
                    }
                }
            }
            i++
        }

        setUserData([...roles])
    }

    const config = {
        forceFit: true,
        title: {
            visible: false,
            text: 'Relação de Usuários e Funções',
        },
        description: {
            visible: false,
            text:
                'Apresenta a quantidade de usuários no sistema em cada função',
        },
        radius: 1,
        data: userData ? userData : [],
        yField: 'value',
        xField: 'type',
        color: '#00843D',
        meta: {
            value: { alias: 'Pessoas na função' },
            type: { alias: 'Função' }
        },
        label: {
            visible: true,
            position: 'middle',
            adjustColor: true,
        },
    };
    return (<Column {...config} style={{ width: "100%" }} />)
};

const mapStateToProps = state => ({
    userRoles: state.userRoles,
})

const mapDispatchToProps = {
    fetchRoles: RolesStore.fetchRoles,
}

export default connect(mapStateToProps, mapDispatchToProps)(RolesPie)