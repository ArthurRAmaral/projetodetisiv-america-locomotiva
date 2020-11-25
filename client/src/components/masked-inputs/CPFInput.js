import React from 'react'
import InputMask from './InputMask'

function CPFInput(props) {
  /* eslint react/jsx-props-no-spreading: 0 */
  return <InputMask {...props} type="tel" format="###.###.###-##" placeholder="000.000.000-00" />
}

export default CPFInput
