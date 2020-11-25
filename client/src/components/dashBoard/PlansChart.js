import React from 'react'
import { Card } from 'antd'

import PlansPie from '../charts/PlansPie'

const PlansChart = () => {

    return (
        <Card title="Pessoas em planos" style={{ width: "100%" }}>
            <PlansPie />
        </Card >
    )
}

export default PlansChart
