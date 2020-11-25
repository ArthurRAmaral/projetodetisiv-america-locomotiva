import React from 'react'
import TextMask from './TextMask'

function CPFMask(props) {
  /* eslint react/jsx-props-no-spreading: 0 */
  return <TextMask format="###.###.###-##" {...props} />
}

export default CPFMask
