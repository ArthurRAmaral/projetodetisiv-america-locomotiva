import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Card } from 'antd'

import logo from '../assets/images/logo.png'
import background from '../assets/images/andrew-mcelroy-XaGNO7bgZa8-unsplash.jpg'

function LoginLayout({ children }) {
  return (
    <Row
      className="h-100"
      justify="center"
      align="middle"
      style={{
        backgroundColor: 'darkgreen',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Col xs={22} md={12} lg={8} xxl={6}>
        <Card>
          <Row className="text-center" justify="center">
            <Col>
              <img className="mb-lg" src={logo} height={50} alt="Logo" />
            </Col>
          </Row>
          <Row className="text-center" justify="center">
            {children}
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

LoginLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default LoginLayout
