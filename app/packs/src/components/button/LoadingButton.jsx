import React from "react";

import Button from "src/components/design_system/button";
import { Spinner, Check } from "src/components/icons";

import cx from "classnames";

const LoadingButton = ({
  loading,
  success,
  fillPrimary,
  fillSecondary,
  opacity,
  checkClassName,
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
          {success ? (
            <Check
              color="currentColor"
              className={cx("mr-2", checkClassName)}
            />
          ) : null}
          {props.children}
        </>
      )}
    </Button>
  );
};

export default LoadingButton;
