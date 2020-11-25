import React from 'react'
import NumberFormat from 'react-number-format'
import { Input } from 'antd'

function InputMask({ ...rest }) {
  /* eslint react/jsx-props-no-spreading: 0 */
  return <NumberFormat mask="" customInput={Input} {...rest} />
}

export default InputMask
