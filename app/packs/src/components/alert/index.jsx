import React from "react";

import Button from "../button";

const AlertContent = ({ text, href, type, buttonText }) => (
  <>
    <p className={`mb-0 mr-md-3`}>{text}</p>
    {href && <Button type={type} text={buttonText} href={href} />}
  </>
);

const Alert = (props) => {
  const { type, text, buttonText, href, direction } = props;

  const typeStyles = `alert-${type} talent-alert-${type}`;
  const flexDirection = direction == "column" ? "column" : "row";
  const children = props.children ? (
    props.children
  ) : (
    <AlertContent text={text} href={href} type={type} buttonText={buttonText} />
  );

  return (
    <div
      className={`alert talent-alert d-flex flex-column flex-sm-${flexDirection} align-items-center justify-content-between ${typeStyles}`}
      role="alert"
    >
      {children}
    </div>
  );
};

export default Alert;
