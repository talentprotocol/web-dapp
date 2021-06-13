import React from 'react'
import PropTypes from 'prop-types'

const Hello = props => (
  <div className="text-primary">
    Hello I'm a react component being used inside Rails! My name is {props.name}
  </div>
)

Hello.defaultProps = {
  name: 'David'
}

Hello.propTypes = {
  name: PropTypes.string
}

export default Hello;
