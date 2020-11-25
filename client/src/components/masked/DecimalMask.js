import React from 'react'
import TextMask from './TextMask'

function DecimalMask(props) {
  /* eslint react/jsx-props-no-spreading: 0 */
  return <TextMask decimalSeparator="," thousandSeparator="." {...props} />
}

export default DecimalMask
