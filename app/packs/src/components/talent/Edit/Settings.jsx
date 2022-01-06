import React, { useState } from "react";

import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";
import TextInput from "src/components/design_system/fields/textinput";
import Button from "src/components/design_system/button";
import Caption from "src/components/design_system/typography/caption";
import { ArrowRight, ArrowLeft } from "src/components/icons";

const Settings = ({ railsContext, mode, ...props }) => {
  const { user, mobile, changeTab } = props;
  const [settings, setSettings] = useState({
    username: user.username || "",
    email: user.email || "",
    password: "",
  });

  const changeAttribute = (attribute, value) => {
    setSettings((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  return (
    <>
      <H5
        className="w-100 text-left"
        mode={mode}
        text="Account Settings"
        bold
      />
      <P2
        className="w-100 text-left"
        mode={mode}
        text="Update your username and manage your account"
      />
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={"Username"}
          mode={mode}
          shortCaption={`Your Talent Protocol URL: /talent/${settings["username"]}`}
          onChange={(e) => changeAttribute("username", e.target.value)}
          value={settings["username"]}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={"Email"}
          type="email"
          mode={mode}
          onChange={(e) => changeAttribute("email", e.target.value)}
          value={settings["email"]}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={"Password"}
          type="password"
          placeholder={"*********"}
          mode={mode}
          onChange={(e) => changeAttribute("password", e.target.value)}
          value={settings["password"]}
          className="w-100"
        />
      </div>
      <Button
        onClick={() => console.log("saving")}
        type="primary-default"
        mode={mode}
        className="mt-3 w-100"
      >
        Change password
      </Button>

      <div className={`divider ${mode} my-3`}></div>
      <div className="d-flex flex-row w-100 justify-content-between">
        <div className={`d-flex flex-column ${mobile ? "w-100" : "w-50 mr-2"}`}>
          <H5
            className="w-100 text-left"
            mode={mode}
            text="Close Account"
            bold
          />
          <P2
            className="w-100 text-left"
            mode={mode}
            text="Delete your account and account data"
          />
        </div>
        <div>
          <Button
            onClick={() => console.log("saving")}
            type="danger-default"
            mode={mode}
          >
            Delete Account
          </Button>
        </div>
      </div>
      {mobile && (
        <div className="d-flex flex-row justify-content-between w-100 my-3">
          <div className="d-flex flex-column">
            <Caption text="PREVIOUS" />
            <div
              className="text-grey cursor-pointer"
              onClick={() => changeTab("Perks")}
            >
              <ArrowLeft color="currentColor" /> Perks
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
