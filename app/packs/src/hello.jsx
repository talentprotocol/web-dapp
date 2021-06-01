import React from 'react'
import PropTypes from 'prop-types'

const Hello = props => (
  <div className="text-primary">Hello {props.name} Investor!</div>
)

Hello.defaultProps = {
  name: 'David'
}

Hello.propTypes = {
  name: PropTypes.string
}

export default Hello;