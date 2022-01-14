import React, { useState } from "react";
import TextInput from "../design_system/fields/textinput";
import RegistrationContainer from "../registration/RegistrationContainer";
import Link from "../design_system/link";
import { useTheme } from "../../contexts/ThemeContext";
import { useWindowDimensionsHook } from "../../utils/window";
import { H5, P2, P3 } from "../design_system/typography";
import { TALENT_PROTOCOL_WEBSITE } from "../../utils/constants";
import { post } from "../../utils/requests";
import cx from "classnames";

const Login = () => {
  const { mobile } = useWindowDimensionsHook();
  const { mode } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitLoginForm = (e) => {
    e.preventDefault();
    post("/session", { session: { email, password } }).then((res) => {
      if (res.error) {
      } else {
        window.location.replace("/");
      }
    });
  };

  return (
    <div
      className={cx(
        "d-flex flex-column align-self-center w-100 h-100",
        mobile
          ? "p-4 justify-content-between"
          : "justify-content-center p-0 registration-box"
      )}
    >
      <div>
        <H5 className="mb-5" text="Login" bold />
        <form onSubmit={submitLoginForm} className="d-flex flex-column w-100">
          <label htmlFor="inputEmail">
            <P2 className="text-black" text="Email Address" bold />
          </label>
          <TextInput
            mode={mode()}
            type="email"
            id="inputEmail"
            ariaDescribedBy="emailHelp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="d-flex justify-content-between mt-4">
            <label htmlFor="inputPassword">
              <P2 className="text-black" text="Password" bold />
            </label>
            <Link text="Forgot Password?" href="/passwords/new" bold />
          </div>
          <TextInput
            mode={mode()}
            type="password"
            id="inputPassword"
            ariaDescribedBy="passwordHelp"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary talent-button primary-default-button extra-big-size-button bold w-100 mt-5"
          >
            Login
          </button>
        </form>
      </div>
      <div className={cx("mt-5 pb-4", mobile && "align-self-center")}>
        <div className="d-flex mb-2">
          <P2 className="text-black mr-1" text="Don't have an invitation?" />
          <Link
            bold
            target="_blank"
            href={TALENT_PROTOCOL_WEBSITE}
            text="Join the waitlist"
          />
        </div>
        <div className="d-flex">
          <P2 className="text-black mr-1" text="Already have an invitation?" />
          <Link bold href="/sign_up" text="Register here" />
        </div>
      </div>
    </div>
  );
};

export default (props, _railsContext) => {
  return () => (
    <RegistrationContainer {...props}>
      <Login {...props} />
    </RegistrationContainer>
  );
};
