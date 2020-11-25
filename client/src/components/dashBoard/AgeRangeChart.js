import React from 'react'
import AgeRangePie from '../charts/AgeRangePie'
import { Card } from 'antd'

const AgeRangeChart = () => {
    
    return (
      <Card title="Faixa etára do clube" style={{ width: "100%" }}>
          <AgeRangePie/>
      </Card>
    )
}

export default AgeRangeChart
