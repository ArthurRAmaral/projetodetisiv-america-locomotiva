export const parseNumber = num => {
  let value = '0'

  if (num && typeof num === 'string') {
    if (num.includes(',')) {
      const integral = num.substr(0, num.indexOf(',')).replace(/\./g, '')
      const decimal = num.substr(num.indexOf(',') + 1)

      value = `${integral}.${decimal}`
    } else {
      value = num.replace(/\./g, '')
    }
  }

  if (typeof num === 'number') {
    return num
  }

  return Number(value)
}

export const formatToBRLCurrency = value =>
  Intl.NumberFormat('pt-br', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)

export default {}
