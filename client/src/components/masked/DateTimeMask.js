import React from 'react'
import TextMask from './TextMask'

function DateTimeMask({ ...rest }) {
  const format = value => {
    const dateValue = new Date(value)
    if (dateValue.valueOf()) {
      const date = dateValue.toLocaleDateString('pt-br')
      const time = dateValue.toLocaleTimeString('pt-br')
      return `${date} ${time}`
    }
    return ''
  }
  /* eslint react/jsx-props-no-spreading: 0 */
  return <TextMask isNumericString format={format} {...rest} />
}

export default DateTimeMask
