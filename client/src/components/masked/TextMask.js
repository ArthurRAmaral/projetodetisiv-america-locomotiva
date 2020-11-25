import React from 'react'
import NumberFormat from 'react-number-format'

function TextMask({ ...rest }) {
  /* eslint react/jsx-props-no-spreading: 0 */
  return <NumberFormat mask="" displayType="text" {...rest} />
}

export default TextMask
