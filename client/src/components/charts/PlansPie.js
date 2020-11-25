import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import { connect } from 'react-redux'
import { message } from 'antd'

import * as PlanListStore from '../../store/ducks/planList'

const PlansPie = ({ planList, fetchPlans }) => {

    const [planData, setPlanData] = useState()

    const hasPlanList = () => planList.length > 0

    useEffect(() => {
        async function fetchData() {
            try {
                await fetchPlans()
            } catch (error) {
                message.error('Erro ao buscar os usuários. Tente recarregar a página.')
            }
        }

        if (!hasPlanList()) {
            fetchData()
        }

        if (!planData && hasPlanList()) {
            createPlanData()
        }

    })

    const createPlanData = () => {
        let auxPlanList = []
        let total = 0
        for (const plan of planList) {
            total += plan.users.length
        }
        console.log(total)
        for (const plan of planList) {
            if (plan.users.length > 0)
                auxPlanList.push({
                    type: plan.name,
                    value: plan.users.length,
                    percentage: ((100 / total) * plan.users.length).toFixed(2)
                })
        }
        setPlanData([...auxPlanList])
    }

    const config = {
        forceFit: true,
        title: {
            visible: false,
            text: 'Relação de Usuários e Planos',
        },
        description: {
            visible: false,
            text:
                'Apresenta a quantidade de usuários no sistema em cada plano',
        },
        radius: 0.9,
        data: planData ? planData : [],
        yField: 'value',
        xField: 'type',
        color: '#00843D',
        meta: {
            value: { alias: 'Pessoas no plano' },
            type: { alias: 'Plano' }
        },
        label: {
            visible: true,
            position: 'middle',
            adjustColor: true,
            formatter: (text, item) => item._origin.value + " - " + item._origin.percentage + "%",
        },
    };
    return (<Column {...config} style={{ width: "100%" }} />)
};

const mapStateToProps = state => ({
    planList: state.planList,
})

const mapDispatchToProps = {
    fetchPlans: PlanListStore.fetchPlans,
}

export default connect(mapStateToProps, mapDispatchToProps)(PlansPie)