import React, { useState, useEffect } from "react";
import TextInput from "../design_system/fields/textinput";
import RegistrationContainer from "../registration/RegistrationContainer";
import Link from "../design_system/link";
import { useTheme } from "src/contexts/ThemeContext";
import { useWindowDimensionsHook } from "src/utils/window";
import { H5, P2, P3 } from "../design_system/typography";
import { USER_GUIDE } from "src/utils/constants";
import { post } from "src/utils/requests";
import cx from "classnames";

const Login = () => {
  const { mobile } = useWindowDimensionsHook();
  const { mode } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: false, password: false });

  const submitLoginForm = (e) => {
    e.preventDefault();
    setErrors({ email: false, password: false });

    post("/session", { session: { email, password } }).then((res) => {
      if (res.error) {
        setErrors((prev) => ({ ...prev, email: true, password: true }));
      } else {
        window.location.replace("/");
      }
    });
  };

  useEffect(() => {
    const script = document.createElement("script");

    script.innerHTML = `!function(a,b,c,d,t){var e,f=a.getElementsByTagName("head")[0];if(!a.getElementById(c)){if(e=a.createElement(b),e.id=c,e.setAttribute("data-vrlps-ucid",d),e.setAttribute("data-vrlps-version","2"), e.setAttribute("data-vrlps-template", t),e.src="https://app.viral-loops.com/popup_assets/js/vl_load_v2.min.js",window.ub){jQuery=null,$=null;var g=a.createElement(b);g.src="https://code.jquery.com/jquery-2.2.4.min.js",f.appendChild(g)}f.appendChild(e);var h=a.createElement("link");h.rel="stylesheet",h.type="text/css",h.href="https://app.viral-loops.com/static/vl-loader.css",f.appendChild(h);var i=a.createElement("div");i.id="vl-overlay",i.style.display="none";var j=a.createElement("div");j.id="vl-loader",i.appendChild(j),a.addEventListener("DOMContentLoaded",function(b){a.body.appendChild(i);for(var c=a.getElementsByClassName("vrlps-trigger"),d=0;d<c.length;d++)c[d].removeAttribute("href"),c[d].onclick=function(){a.getElementById("vl-overlay").style.display="block"};var e=a.querySelectorAll("[data-vl-widget='popupTrigger']");[].forEach.call(e,function(b){var c=a.createElement("div");c.className="vl-embedded-cta-loader",b.appendChild(c)})})}}(document,"script","vrlps-js","wzibQEVPjtucE2keZEzIPOrVPcs","waitlist")`;
    script.id = "ViralLoops";

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className={cx(
        "d-flex flex-column align-self-center",
        mobile
          ? "p-4 justify-content-between w-100 h-100"
          : "justify-content-center p-0 registration-box"
      )}
    >
      <div>
        <H5 className="mb-6" text="Login" bold />
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
          {errors["password"] && (
            <P3 className="mt-2 text-danger" text="Wrong password or email" />
          )}
          <button
            type="submit"
            className="btn btn-primary talent-button primary-default-button extra-big-size-button bold w-100 mt-6"
          >
            Login
          </button>
        </form>
      </div>
      <div className={cx("mt-6 pb-4", mobile && "align-self-center")}>
        <div className="d-flex mb-2">
          <P2 className="text-black mr-1" text="Don't have an invitation?" />
          <Link
            className="vrlps-trigger"
            bold
            href="#"
            text="Join the waitlist"
          />
        </div>
        <div className="d-flex mb-2">
          <P2 className="text-black mr-1" text="Already have an invitation?" />
          <Link bold href="/sign_up" text="Register here" />
        </div>
        <div className="d-flex">
          <P2 className="text-black mr-1" text="Want more info?" />
          <Link
            bold
            href={USER_GUIDE}
            target="_blank"
            text="Check our user guide"
          />
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
