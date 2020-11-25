import React from 'react'
import InputMask from './InputMask'

function DateInput(props) {
  /* eslint react/jsx-props-no-spreading: 0 */
  return <InputMask type="tel" format="##/##/####" placeholder="dd/mm/aaaa" {...props} />
}

export default DateInput
