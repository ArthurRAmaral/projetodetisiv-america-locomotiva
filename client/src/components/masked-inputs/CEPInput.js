import React from 'react'
import InputMask from './InputMask'

function CEPInput(props) {
  /* eslint react/jsx-props-no-spreading: 0 */
  return <InputMask {...props} type="tel" format="#####-###" placeholder="00000-000" />
}

export default CEPInput
