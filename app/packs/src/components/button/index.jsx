import React from "react"
import PropTypes from "prop-types"
import BootstrapButton from "react-bootstrap/Button"

const PrimaryButton = props => (
  <BootstrapButton variant="primary" className="talent-button" {...props}>
    {props.text}
  </BootstrapButton>
)

const SecondaryButton = props => (
  <BootstrapButton variant="secondary" className="talent-button" {...props}>
    {props.text}
  </BootstrapButton>
)

const Button = props => {
  if (props.type == "primary") {
    return <PrimaryButton {...props} />
  } else if (props.type == "secondary") {
    return <SecondaryButton {...props} />
  } else {
    return <BootstrapButton {...props} />
  }
}

Button.defaultProps = { }

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string.isRequired
}

export default Button
