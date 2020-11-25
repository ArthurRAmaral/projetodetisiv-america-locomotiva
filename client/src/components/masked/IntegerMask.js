import React from 'react'
import DecimalMask from './DecimalMask'

function IntegerMask(props) {
  /* eslint react/jsx-props-no-spreading: 0 */
  return <DecimalMask {...props} decimalScale={0} />
}

export default IntegerMask
