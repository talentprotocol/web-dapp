import React from "react";
import PropTypes from "prop-types";

const PrimaryDefaultButton = (props) => (
  <button
    className={
      `
        talent-button
        primary-default-button
        ${props.mode}
        ${props.size}-size-button
        ${props.className}
      `
    }
    {...props}
  >
    {props.text ? props.text : props.children}
  </button>
);

const PrimaryOutlineButton = (props) => (
  <button
    className={
      `
        talent-button
        primary-outline-button
        ${props.mode}
        ${props.size}-size-button
        ${props.className}
      `
    }
    {...props}
  >
    {props.text ? props.text : props.children}
  </button>
);

const PrimaryGhostButton = (props) => (
  <button
    className={
      `
        talent-button
        primary-ghost-button
        ${props.mode}
        ${props.size}-size-button
        ${props.className}
      `
    }
    {...props}
  >
    {props.text ? props.text : props.children}
  </button>
);

const PrimarySubtleButton = (props) => (
  <button
    className={
      `
        talent-button
        primary-subtle-button
        ${props.mode}
        ${props.size}-size-button
        ${props.className}
      `
    }
    {...props}
  >
    {props.text ? props.text : props.children}
  </button>
);

const DangerDefaultButton = (props) => (
  <button
    className={
      `
        talent-button
        danger-default-button
        ${props.mode}
        ${props.size}-size-button
        ${props.className}
      `
    }
    {...props}
  >
    {props.text ? props.text : props.children}
  </button>
);

const DangerOutlineButton = (props) => (
  <button
    className={
      `
        talent-button
        danger-outline-button
        ${props.mode}
        ${props.size}-size-button
        ${props.className}
      `
    }
    {...props}
  >
    {props.text ? props.text : props.children}
  </button>
);

const DangerGhostButton = (props) => (
  <button
    className={
      `
        talent-button
        danger-ghost-button
        ${props.mode}
        ${props.size}-size-button
        ${props.className}
      `
    }
    {...props}
  >
    {props.text ? props.text : props.children}
  </button>
);

const DangerSubtleButton = (props) => (
  <button
    className={
      `
        talent-button
        danger-subtle-button
        ${props.mode}
        ${props.size}-size-button
        ${props.className}
      `
    }
    {...props}
  >
    {props.text ? props.text : props.children}
  </button>
);

const WhiteDefaultButton = (props) => (
  <button
    className={
      `
        talent-button
        white-default-button
        ${props.mode}
        ${props.size}-size-button
        ${props.className}
      `
    }
    {...props}
  >
    {props.text ? props.text : props.children}
  </button>
);

const WhiteOutlineButton = (props) => (
  <button
    className={
      `
        talent-button
        white-outline-button
        ${props.mode}
        ${props.size}-size-button
        ${props.className}
      `
    }
    {...props}
  >
    {props.text ? props.text : props.children}
  </button>
);

const WhiteGhostButton = (props) => (
  <button
    className={
      `
        talent-button
        white-ghost-button
        ${props.mode}
        ${props.size}-size-button
        ${props.className}
      `
    }
    {...props}
  >
    {props.text ? props.text : props.children}
  </button>
);

const WhiteSubtleButton = (props) => (
  <button
    className={
      `
        talent-button
        white-subtle-button
        ${props.mode}
        ${props.size}-size-button
        ${props.className}
      `
    }
    {...props}
  >
    {props.text ? props.text : props.children}
  </button>
);

const Button = (props) => {
  if (props.type == "primary-default") {
    return <PrimaryDefaultButton {...props} />;
  } else if (props.type == "primary-outline") {
    return <PrimaryOutlineButton {...props} />;
  } else if (props.type == "primary-ghost") {
    return <PrimaryGhostButton {...props} />;
  } else if (props.type == "primary-subtle") {
    return <PrimarySubtleButton {...props} />;
  } else if (props.type == "white-default") {
    return <WhiteDefaultButton {...props} />;
  } else if (props.type == "white-outline") {
    return <WhiteOutlineButton {...props} />;
  } else if (props.type == "white-ghost") {
    return <WhiteGhostButton {...props} />;
  } else if (props.type == "white-subtle") {
    return <WhiteSubtleButton {...props} />;
  } else if (props.type == "danger-default") {
    return <DangerDefaultButton {...props} />;
  } else if (props.type == "danger-outline") {
    return <DangerOutlineButton {...props} />;
  } else if (props.type == "danger-ghost") {
    return <DangerGhostButton {...props} />;
  } else if (props.type == "danger-subtle") {
    return <DangerSubtleButton {...props} />;
  } else {
    return <PrimaryDefaultButton {...props} />;
  }
};

Button.defaultProps = {
  mode: "light",
  size: "base"
};

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(["light", "dark"]),
  size: PropTypes.oneOf(["base", "big", "extra-big"]),
};

export default Button;
