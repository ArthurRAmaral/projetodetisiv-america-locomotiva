import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, message } from 'antd'
import axios from 'axios'
import CEPInput from './masked-inputs/CEPInput'

class CepSearchInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
    this.form = React.createRef()
    this.cepCancel = axios.CancelToken.source()
  }

  handleCepChange = async ({ value }) => {
    const { onSearchResult } = this.props
    if (value && value.length === 8) {
      this.setState({ loading: true })
      try {
        const { data } = await axios.get(`http://cep.la/${value}`, {
          headers: { Accept: 'application/json' },
          cancelToken: this.cepCancel.token,
        })

        onSearchResult(data)
      } catch (error) {
        if (!axios.isCancel(error)) {
          message.warn('Serviço de busca de CEP indisponível no momento.')
        }
      }
    } else {
      // cancela a requisição ao apagar
      this.cepCancel.cancel()
      this.cepCancel = axios.CancelToken.source()
    }
    this.setState({ loading: false })
  }

  render() {
    const { loading } = this.state
    const { onSearchResult, ...rest } = this.props
    return (
      <CEPInput
        customInput={Input.Search}
        loading={loading}
        onValueChange={this.handleCepChange}
        onSearch={value => this.handleCepChange({ value })}
        /* eslint react/jsx-props-no-spreading: 0 */
        {...rest}
      />
    )
  }
}

CepSearchInput.propTypes = {
  onSearchResult: PropTypes.func.isRequired,
}

export default CepSearchInput
