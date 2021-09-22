import React, { useState } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { patch, post, destroy } from "src/utils/requests";

import Button from "../../../button";

const EditPerk = ({
  talent,
  selectedPerk,
  setMode,
  perks,
  updateSharedState,
}) => {
  const [saving, setSaving] = useState(false);
  const [destroying, setDestroying] = useState(false);
  const [perksInfo, setPerksInfo] = useState({
    id: selectedPerk.id || "",
    title: selectedPerk.title || "",
    price: selectedPerk.price || "",
  });

  const changeAttribute = (attribute, value) => {
    setPerksInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  const handleDestroy = async (e) => {
    e.preventDefault();
    setDestroying(true);
    const response = await destroy(
      `/api/v1/talent/${talent.id}/perks/${perksInfo["id"]}`
    ).catch(() => setDestroying(false));

    if (response) {
      const perkIndex = perks.findIndex((perk) => perk.id == perksInfo["id"]);
      let newPerks = [...perks];
      if (perkIndex > -1) {
        newPerks.splice(perkIndex);
      }

      updateSharedState((prevState) => ({
        ...prevState,
        perks: newPerks,
      }));
    }

    setDestroying(false);
    setMode("view");
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setMode("view");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let requestType, url;
    if (perksInfo["id"] != "") {
      requestType = patch;
      url = `/api/v1/talent/${talent.id}/perks/${perksInfo["id"]}`;
    } else {
      requestType = post;
      url = `/api/v1/talent/${talent.id}/perks`;
    }

    const response = await requestType(url, {
      perk: {
        price: perksInfo["price"],
        title: perksInfo["title"],
      },
    }).catch(() => setSaving(false));

    if (response) {
      const perkIndex = perks.findIndex((perk) => perk.id == perksInfo["id"]);
      let newPerks = [...perks];
      if (perkIndex > -1) {
        newPerks.splice(perkIndex);
      }

      newPerks.push(response);
      newPerks.sort((fItem, lItem) => {
        if (fItem.price > lItem.price) {
          return 1;
        } else if (fItem.price < lItem.price) {
          return -1;
        }
        return 0;
      });

      updateSharedState((prevState) => ({
        ...prevState,
        perks: newPerks,
      }));
    }

    setSaving(false);
    setMode("view");
  };

  return (
    <form>
      <div className="form-group">
        <label htmlFor="title">Price</label>
        <input
          id="price"
          className="form-control"
          placeholder="Amount of your Talent Token required"
          value={perksInfo["price"]}
          onChange={(e) => changeAttribute("price", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          className="form-control"
          placeholder="Describe the service"
          value={perksInfo["title"]}
          onChange={(e) => changeAttribute("title", e.target.value)}
        />
      </div>
      <div className="mb-2 d-flex flex-row-reverse align-items-end">
        <button
          disabled={saving}
          onClick={handleSave}
          className="btn btn-primary talent-button ml-2"
        >
          {saving ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin /> Saving
            </>
          ) : (
            "Save"
          )}
        </button>
        <Button type="secondary" text="Cancel" onClick={handleCancel} />
        {perksInfo["id"] != "" && (
          <button
            disabled={destroying}
            onClick={handleDestroy}
            className="btn btn-danger talent-button mr-2"
          >
            {destroying ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Delete
              </>
            ) : (
              "Delete"
            )}
          </button>
        )}
      </div>
    </form>
  );
};

const ViewPerks = ({ perks, setSelectedPerk }) => {
  return (
    <div className="d-flex flex-column mt-3">
      {perks.length == 0 && (
        <li className="list-group-item">
          <small className="text-muted">
            Start by creating your first perk!
          </small>
        </li>
      )}
      {perks.map((perk) => {
        return (
          <button
            key={`perk_${perk.id}`}
            className="btn btn-outline-secondary w-100 rounded-0 text-left"
            onClick={() => setSelectedPerk(perk)}
          >
            <div className="d-flex flex-row w-100 justify-content-between">
              <h5 className="mb-1">
                {perk.price} <small>Talent Tokens</small>
              </h5>
            </div>
            <p className="mb-1">{perk.title}</p>
          </button>
        );
      })}
    </div>
  );
};

const Perks = (props) => {
  const [mode, setMode] = useState("view");
  const [selectedPerk, setSelectedPerk] = useState({});

  const selectPerk = (perk) => {
    setSelectedPerk(perk);
    setMode("edit");
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setSelectedPerk({});
  };

  return (
    <div className="col-md-8 mx-auto d-flex flex-column my-3">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <h4>Perks</h4>
        {mode != "edit" && (
          <Button
            type="primary"
            text="Add Perk"
            onClick={() => setMode("edit")}
          />
        )}
      </div>
      {mode == "edit" && (
        <EditPerk {...props} selectedPerk={selectedPerk} setMode={changeMode} />
      )}
      {mode == "view" && <ViewPerks {...props} setSelectedPerk={selectPerk} />}
    </div>
  );
};

export default Perks;
