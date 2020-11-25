import React from 'react'
import TextMask from './TextMask'

function DateMask({ ...rest }) {
  const format = value => {
    if (value) {
      return new Date(value).toLocaleDateString('pt-br')
    }
    return ''
  }
  /* eslint react/jsx-props-no-spreading: 0 */
  return <TextMask format={format} {...rest} />
}

export default DateMask
