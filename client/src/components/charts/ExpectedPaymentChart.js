import React, { useState, useEffect } from 'react'
import { Bar } from '@ant-design/charts'
import { connect } from 'react-redux'
import { message } from 'antd'

import * as DashboardDataStore from '../../store/ducks/dashboardData'
import { monthArray, getMonthName } from '../../util/dateUtil'

const ExpectedPaymentChart = ({ expectetionsData, fetchExpectations, teamName }) => {
  const [fetchedData, setFetchedData] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchExpectations()
      } catch (error) {
        message.error('Erro ao buscar os usuários. Tente recarregar a página.')
      }
    }

    if (!fetchedData) {
      fetchData()
      setFetchedData(true)
    }
  }, [fetchedData, fetchExpectations])

  const getData = () => {
    const newArray = []

    expectetionsData
      .filter(item => {
        return teamName ? item.teams.includes(teamName) : true
      })
      .forEach(item => {
        const searchResult = newArray.find(
          newItem => item.isPaid === newItem.isPaid && item.month === newItem.month
        )
        const index = newArray.indexOf(searchResult)
        if (index < 0) {
          newArray.push(item)
        } else {
          const actual = newArray[index]
          actual.references.concat(item.references)
          newArray[index] = {
            ...actual,
            value: actual.value + item.value,
          }
        }
      })
    monthArray.forEach(month => {
      const searchNotPaidResult = newArray.find(item => item.month === month.num && !item.isPaid)
      const searchPaidResult = newArray.find(item => item.month === month.num && item.isPaid)

      const relativeDate = new Date()
      relativeDate.setMonth(relativeDate.getMonth() - 6)
      relativeDate.setDate(1)

      if (!searchPaidResult) {
        newArray.push({
          year: month.num < relativeDate.getMonth() ? 2021 : 2020,
          month: month.num,
          value: 0,
          isPaid: true,
        })
      }

      if (!searchNotPaidResult) {
        newArray.push({
          year: month.num < relativeDate.getMonth() ? 2021 : 2020,
          month: month.num,
          value: 0,
          isPaid: false
        })
      }
    })

    return newArray
      .sort((a, b) => (a.isPaid ? 1 : -1))
      .sort((a, b) => {
        const init = new Date()
        init.setMonth(init.getMonth() - 6)
        const month = init.getMonth()
        const firstValue = a.month < month ? 0 - month - a.month : month + a.month
        const secondValue = b.month < month ? 0 - month - b.month : month + b.month

        if (firstValue >= 0 && secondValue >= 0) return firstValue - secondValue
        if (firstValue >= 0 && secondValue < 0) return -1
        if (firstValue < 0 && secondValue >= 0) return 1
        if (firstValue < 0 && secondValue < 0) return secondValue - firstValue
        return 0
      })
      .map(item => ({
        ...item,
        isPaid: item.isPaid ? 'pago' : 'não pago',
        month: `${getMonthName(item.month)}/${item.year}`,
      }))
  }
  const config = {
    data: getData(),
    isStack: true,
    xField: 'value',
    yField: 'month',
    seriesField: 'isPaid',
    label: {
      position: 'middle',
      style: {
        fill: '#FFF',
      },

      formatter: ({ value }) => {
        return value > 0
          ? Intl.NumberFormat('pt', {
            style: 'currency',
            currency: 'BRL',
          }).format(value)
          : ''
      },
      layout: [{ type: 'interval-adjust-position' }, { type: 'adjust-color' }],
    },
    colorField: 'isPaid',
    color: ({ isPaid }) => {
      return isPaid === 'pago' ? 'green' : 'red'
    },
    barStyle: {
      opacity: 0.5,
      fillOpacity: 0.5,
      strokeOpacity: 0.5,
    },
    tooltip: {
      formatter: item => {
        return {
          name: item.isPaid,
          value: Intl.NumberFormat('pt', {
            style: 'currency',
            currency: 'BRL',
          }).format(item.value),
        }
      },
    },
  }

  return <Bar {...config} style={{ width: '100%' }} />
}

const mapStateToProps = state => ({
  expectetionsData: state.dashboardData.expectetions,
})

const mapDispatchToProps = {
  fetchExpectations: DashboardDataStore.fetchExpectations,
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpectedPaymentChart)
