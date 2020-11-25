import React from 'react'
import InputMask from './InputMask'

function IntegerInput(props) {
  /* eslint react/jsx-props-no-spreading: 0 */
  return (
    <InputMask
      decimalSeparator=","
      thousandSeparator="."
      placeholder="0"
      {...props}
      decimalScale={0}
    />
  )
}

export default IntegerInput
