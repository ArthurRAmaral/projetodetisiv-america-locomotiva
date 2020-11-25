import React from 'react'
import InputMask from './InputMask'

function DecimalInput(props) {
  /* eslint react/jsx-props-no-spreading: 0 */
  return <InputMask decimalSeparator="," thousandSeparator="." placeholder="0,00" {...props} />
}

export default DecimalInput
