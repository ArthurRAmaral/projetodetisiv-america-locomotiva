import React from 'react'
import PropTypes from 'prop-types'
import TextMask from './TextMask'

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
  return <TextMask value={value} format={mask} {...rest} />
}

PhoneInput.propTypes = {
  value: PropTypes.string,
}

PhoneInput.defaultProps = {
  value: '',
}

export default PhoneInput
