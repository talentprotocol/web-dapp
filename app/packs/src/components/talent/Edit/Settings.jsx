import React, { useState } from "react";

import { destroy, patch } from "src/utils/requests";

import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";
import TextInput from "src/components/design_system/fields/textinput";
import Button from "src/components/design_system/button";
import Caption from "src/components/design_system/typography/caption";
import { ArrowLeft } from "src/components/icons";

const Settings = (props) => {
  const {
    user,
    mobile,
    changeTab,
    mode,
    togglePublicProfile,
    publicButtonType,
    disablePublicButton,
  } = props;
  const [settings, setSettings] = useState({
    username: user.username || "",
    email: user.email || "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const changeAttribute = (attribute, value) => {
    setSettings((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  const updateUser = async () => {
    const response = await patch(`/api/v1/users/${user.id}`, {
      user: { ...settings },
    }).catch(() => setValidationErrors((prev) => ({ ...prev, saving: true })));

    if (response) {
      if (response.status == 200) {
        changeSharedState((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            ...response.user,
          },
        }));
      } else {
        setValidationErrors((prev) => ({ ...prev, ...response.errors }));
      }
    }
  };

  const deleteUser = async () => {
    const response = await destroy(`/api/v1/users/${user.id}`).catch(() =>
      setValidationErrors((prev) => ({ ...prev, deleting: true }))
    );

    if (response && response.success) {
      window.location.href = "/";
    } else {
      setValidationErrors((prev) => ({ ...prev, deleting: true }));
    }
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
      <div className="d-flex flex-row w-100 flex-wrap justify-content-between mt-3">
        <TextInput
          title={"Username"}
          mode={mode}
          shortCaption={`Your Talent Protocol URL: /talent/${settings["username"]}`}
          onChange={(e) => changeAttribute("username", e.target.value)}
          value={settings["username"]}
          className="w-100"
          required={true}
          error={validationErrors?.username}
        />
        {validationErrors?.username && (
          <Caption className="text-danger" text="Username is already taken." />
        )}
      </div>
      <div className="d-flex flex-row w-100 flex-wrap mt-3">
        <TextInput
          title={"Email"}
          type="email"
          mode={mode}
          onChange={(e) => changeAttribute("email", e.target.value)}
          value={settings["email"]}
          className="w-100"
          required={true}
          error={validationErrors?.email}
        />
        {validationErrors?.email && (
          <Caption className="text-danger" text="Email is already taken." />
        )}
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
          required={true}
          error={validationErrors?.password}
        />
      </div>
      <Button
        onClick={() => updateUser()}
        type="primary-default"
        mode={mode}
        className="mt-3 w-100"
      >
        Change password
      </Button>
      <div className={`divider ${mode} my-3`}></div>
      <div className="d-flex flex-row w-100 justify-content-between my-3">
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
            onClick={() => deleteUser()}
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
      <div
        className={`d-flex flex-row ${
          mobile ? "justify-content-between" : "justify-content-end"
        } w-100`}
      >
        {mobile && (
          <Button
            onClick={togglePublicProfile}
            type={publicButtonType}
            disabled={disablePublicButton}
            mode={mode}
            className="ml-auto mr-3"
          >
            {props.talent.public ? "Public" : "Publish Profile"}
          </Button>
        )}
        <Button onClick={() => updateUser()} type="primary-default" mode={mode}>
          Save Profile
        </Button>
      </div>
    </>
  );
};

export default Settings;
