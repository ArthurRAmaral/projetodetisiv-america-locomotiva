import React from 'react'
import TextMask from './TextMask'

function MoneyMask(props) {
  /* eslint react/jsx-props-no-spreading: 0 */
  return (
    <TextMask
      decimalSeparator=","
      thousandSeparator="."
      decimalScale={2}
      fixedDecimalScale
      prefix="R$ "
      {...props}
    />
  )
}

export default MoneyMask
