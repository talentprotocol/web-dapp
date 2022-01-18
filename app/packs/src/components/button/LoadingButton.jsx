import React from "react";

import Button from "src/components/design_system/button";
import { Spinner, Check } from "src/components/icons";

const LoadingButton = ({
  loading,
  success,
  fillPrimary,
  fillSecondary,
  opacity,
  ...props
}) => {
  return (
    <Button {...props}>
      {loading ? (
        <Spinner
          width={16}
          className="mx-4"
          fillPrimary={fillPrimary}
          fillSecondary={fillSecondary}
          opacity={opacity}
        />
      ) : (
        <>
          {success ? <Check color="currentColor" className="mr-2" /> : null}
          {props.children}
        </>
      )}
    </Button>
  );
};

export default LoadingButton;
