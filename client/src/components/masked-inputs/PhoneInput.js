import React from 'react'
import PropTypes from 'prop-types'
import InputMask from './InputMask'

function PhoneInput({ value, ...rest }) {
  let mask = Array(50)
    .fill('#')
    .join('')

  if (value) {
    const { length } = value.replace(/\D/g, '')
    if (length <= 10) {
      mask = '(##) ####-#####'
    } else if (length === 11) {
      mask = '(##) #####-#####'
    }
  }

  /* eslint react/jsx-props-no-spreading: 0 */
  return (
    <InputMask type="tel" value={value} format={mask} placeholder="(00) 00000-0000" {...rest} />
  )
}

PhoneInput.propTypes = {
  value: PropTypes.string,
}

PhoneInput.defaultProps = {
  value: '',
}

export default PhoneInput
