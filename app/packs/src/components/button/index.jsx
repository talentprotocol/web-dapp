import React from "react";
import PropTypes from "prop-types";
import BootstrapButton from "react-bootstrap/Button";

const PrimaryButton = (props) => (
  <BootstrapButton variant="primary" className="talent-button" {...props}>
    {props.icon}
    {props.text}
  </BootstrapButton>
);

const SecondaryButton = (props) => (
  <BootstrapButton variant="secondary" className="talent-button" {...props}>
    {props.icon}
    {props.text}
  </BootstrapButton>
);

const InfoButton = (props) => (
  <BootstrapButton variant="info" className="talent-button" {...props}>
    {props.icon}
    {props.text}
  </BootstrapButton>
);

const SuccessButton = (props) => (
  <BootstrapButton variant="success" className="talent-button" {...props}>
    {props.icon}
    {props.text}
  </BootstrapButton>
);

const DangerButton = (props) => (
  <BootstrapButton variant="danger" className="talent-button" {...props}>
    {props.icon}
    {props.text}
  </BootstrapButton>
);

const WarningButton = (props) => (
  <BootstrapButton variant="warning" className="talent-button" {...props}>
    {props.icon}
    {props.text}
  </BootstrapButton>
);

const LightButton = (props) => (
  <BootstrapButton variant="light" className="talent-button" {...props}>
    {props.icon}
    {props.text}
  </BootstrapButton>
);

const OutlineSecondaryButton = (props) => (
  <BootstrapButton
    variant="outline-secondary"
    className="talent-button"
    {...props}
  >
    {props.icon}
    {props.text}
  </BootstrapButton>
);

const Button = (props) => {
  if (props.type == "primary") {
    return <PrimaryButton {...props} />;
  } else if (props.type == "secondary") {
    return <SecondaryButton {...props} />;
  } else if (props.type == "info") {
    return <InfoButton {...props} />;
  } else if (props.type == "success") {
    return <SuccessButton {...props} />;
  } else if (props.type == "warning") {
    return <WarningButton {...props} />;
  } else if (props.type == "danger") {
    return <DangerButton {...props} />;
  } else if (props.type == "light") {
    return <LightButton {...props} />;
  } else if (props.type == "outline-secondary") {
    return <OutlineSecondaryButton {...props} />;
  } else {
    return <BootstrapButton {...props}>{props.text}</BootstrapButton>;
  }
};

Button.defaultProps = {};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string.isRequired,
};

export default Button;
