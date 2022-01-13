import React, { useState } from "react";

import { destroy, patch, post } from "src/utils/requests";

import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";
import TextInput from "src/components/design_system/fields/textinput";
import Button from "src/components/design_system/button";
import Caption from "src/components/design_system/typography/caption";
import { ArrowRight, ArrowLeft, Delete } from "src/components/icons";
import LoadingButton from "src/components/button/LoadingButton";

const emptyPerk = (id) => ({
  id: id,
  title: "",
  price: "",
  description: "",
});

const PerkForm = ({
  perk,
  changeAttribute,
  showAddNew,
  mobile,
  mode,
  removePerk,
  validationErrors,
  addPerk,
  token,
}) => {
  return (
    <>
      <div className="d-flex flex-row w-100 justify-content-between mt-4">
        <TextInput
          title={"Title"}
          mode={mode}
          placeholder={"Social Media, Streaming, Consultant..."}
          onChange={(e) => changeAttribute("title", e.target.value)}
          value={perk["title"]}
          className={"w-100"}
          required={true}
          error={validationErrors?.title}
        />
      </div>
      {/* <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={"Description"}
          mode={mode}
          shortCaption="Describe the perk"
          onChange={(e) => changeAttribute("description", e.target.value)}
          value={perk["description"]}
          className="w-100"
          maxLength={240}
          required={true}
          error={validationErrors?.description}
        />
      </div> */}
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <div className={`d-flex flex-column ${mobile ? "w-100" : "w-50 pr-2"}`}>
          <TextInput
            title={`Amount ${token.ticker || ""}`}
            type="number"
            mode={mode}
            placeholder={"0,000.00"}
            shortCaption={
              "Amount of talent tokens the supporter must hold to redeem this perk."
            }
            onChange={(e) => changeAttribute("price", e.target.value)}
            value={perk["price"]}
            className="w-100"
            required={true}
            error={validationErrors?.price}
          />
        </div>
        {!showAddNew && (
          <Button
            onClick={() => removePerk(perk["id"])}
            type="white-ghost"
            mode={mode}
          >
            <Delete color="currentColor" />
          </Button>
        )}
      </div>
      {showAddNew && (
        <Button
          onClick={addPerk}
          type="white-ghost"
          mode={mode}
          className="text-primary w-100 my-3"
        >
          + Add another Perk
        </Button>
      )}
      <div className={`divider ${mode} my-3`}></div>
    </>
  );
};

const arrayToObject = (inputArray) => {
  const obj = {};

  inputArray.forEach((element) => (obj[element.id] = element));

  return obj;
};

const Perks = (props) => {
  const {
    perks,
    token,
    mode,
    mobile,
    changeTab,
    changeSharedState,
    togglePublicProfile,
    publicButtonType,
    disablePublicButton,
  } = props;
  const [allPerks, setAllPerks] = useState({
    new: emptyPerk("new"),
    ...arrayToObject(perks),
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [hasChanges, setHasChanges] = useState({});
  const [saving, setSaving] = useState({
    loading: false,
    profile: false,
    public: false,
  });

  const changeAttribute = (key, attribute, value) => {
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }

    if (key != "new" && hasChanges[key] != true) {
      setHasChanges((prev) => ({ ...prev, [key]: true }));
    }

    setAllPerks((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [attribute]: value,
      },
    }));
  };

  const sortAllPerkKeys = (key1, key2) => {
    if (key1.includes("new")) {
      if (key2.includes("new")) {
        return key1.length > key2.length ? -1 : 1;
      } else {
        return -1;
      }
    } else if (key2.includes("new")) {
      return -1;
    } else {
      return parseInt(key1) > parseInt(key2) ? -1 : 1;
    }
  };

  const perkValid = (id) => {
    const errors = {};
    if (allPerks[id].title == "") {
      errors["title"] = true;
    }
    if (allPerks[id].price == "") {
      errors["price"] = true;
    }
    // if (allPerks[id].description == "") {
    //   errors["description"] = true;
    // }
    return errors;
  };

  const addPerk = async (id) => {
    const errors = perkValid(id);

    if (Object.keys(errors).length == 0) {
      // add new perk and reset

      let requestType, url;
      if (id != "new") {
        requestType = patch;
        url = `/api/v1/talent/${props.talent.id}/perks/${id}`;
      } else {
        requestType = post;
        url = `/api/v1/talent/${props.talent.id}/perks`;
      }

      const response = await requestType(url, {
        perk: {
          ...allPerks[id],
        },
      }).catch(() =>
        setValidationErrors((prev) => ({ ...prev, saving: true }))
      );

      if (response) {
        // update local state
        const newPerks = { ...allPerks };
        newPerks[response.id] = response;
        setAllPerks(newPerks);
        setHasChanges((prev) => ({ ...prev, id: false }));

        // update global state
        let newPerksProps = [...perks];
        const perkIndex = perks.findIndex((perk) => perk.id == response["id"]);

        if (perkIndex > -1) {
          newPerksProps.splice(perkIndex, 1);
        }

        newPerksProps.push(response);

        changeSharedState((prevState) => ({
          ...prevState,
          perks: newPerksProps,
        }));
      }
    } else {
      setValidationErrors((prev) => ({ ...prev, ["new"]: errors }));
    }
  };

  const removePerk = async (id) => {
    let response;
    if (typeof id == "number") {
      response = await destroy(
        `/api/v1/talent/${props.talent.id}/perks/${id}`
      ).catch(() =>
        setValidationErrors((prev) => ({ ...prev, removing: true }))
      );
    } else {
      response = true;
    }

    if (response) {
      setHasChanges((prev) => ({ ...prev, id: false }));
      const perkIndex = perks.findIndex((perk) => perk.id == id);
      let newPerks = [...perks];
      if (perkIndex > -1) {
        newPerks.splice(perkIndex, 1);
      }

      changeSharedState((prevState) => ({
        ...prevState,
        perks: newPerks,
      }));

      let updatedPerkState = { ...allPerks };
      delete updatedPerkState[id];
      setAllPerks(updatedPerkState);
    }
  };

  const updatePerks = () => {
    setSaving((prev) => ({ ...prev, loading: true }));

    const ids = Object.keys(hasChanges).filter((id) => hasChanges[id]);
    ids.forEach((id) => addPerk(id));

    setSaving((prev) => ({ ...prev, loading: false, profile: true }));
  };

  const onTogglePublic = async () => {
    setSaving((prev) => ({ ...prev, loading: true }));
    await togglePublicProfile();
    setSaving((prev) => ({ ...prev, loading: false, public: true }));
  };

  return (
    <>
      <H5 className="w-100 text-left" mode={mode} text="Perks" bold />
      <P2
        className="w-100 text-left"
        mode={mode}
        text="Describe what your tokens holders will have access to."
      />
      {Object.keys(allPerks)
        .sort(sortAllPerkKeys)
        .map((currentPerk, index) => (
          <PerkForm
            key={`perk-list-${allPerks[currentPerk].id}`}
            perk={allPerks[currentPerk]}
            changeAttribute={(attribute, value) =>
              changeAttribute(currentPerk, attribute, value)
            }
            showAddNew={index == 0}
            mode={mode}
            mobile={mobile}
            removePerk={removePerk}
            addPerk={() => addPerk("new")}
            validationErrors={validationErrors[allPerks[currentPerk].id]}
            token={token}
          />
        ))}
      {mobile && (
        <div className="d-flex flex-row justify-content-between w-100 my-3">
          <div className="d-flex flex-column">
            <Caption text="PREVIOUS" />
            <div
              className="text-grey cursor-pointer"
              onClick={() => changeTab("Token")}
            >
              <ArrowLeft color="currentColor" /> Token
            </div>
          </div>
          <div className="d-flex flex-column">
            <Caption text="NEXT" />
            <div
              className="text-grey cursor-pointer"
              onClick={() => changeTab("Settings")}
            >
              Settings <ArrowRight color="currentColor" />
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
          <LoadingButton
            onClick={() => onTogglePublic()}
            type={publicButtonType}
            disabled={disablePublicButton || saving["loading"]}
            mode={mode}
            loading={saving["loading"]}
            success={saving["public"]}
            className="ml-auto mr-3"
          >
            {props.talent.public ? "Public" : "Publish Profile"}
          </LoadingButton>
        )}
        <LoadingButton
          onClick={() => updatePerks()}
          type="white-subtle"
          mode={mode}
          disabled={saving["loading"]}
          loading={saving["loading"]}
          success={saving["profile"]}
          className="text-black"
        >
          Save Profile
        </LoadingButton>
      </div>
    </>
  );
};

export default Perks;
