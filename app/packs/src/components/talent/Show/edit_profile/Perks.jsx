import React, { useState } from "react";

import { patch } from "src/utils/requests";

import Button from "../../../button";

const EditPerk = () => {
  const [perksInfo, setPerksInfo] = useState({
    title: "",
    price: "",
  });

  const changeAttribute = (attribute, value) => {
    setPerksInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
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
      <div className="mb-2 d-flex flex-row align-items-end justify-content-between">
        <Button type="secondary" text="Cancel" onClick={() => null} />
        <Button type="primary" text="Save" onClick={() => null} />
      </div>
    </form>
  );
};

const ViewPerks = () => {
  const perks = { 1: { id: 1, title: "hello", price: "123" } };

  return (
    <div className="d-flex flex-column mt-3">
      {Object.keys(perks).length == 0 && (
        <li className="list-group-item">
          <small className="text-muted">
            Start by creating your first perk!
          </small>
        </li>
      )}
      {Object.keys(perks).map((perk_id) => {
        return (
          <button
            key={`perk_${perk_id}`}
            className="btn btn-outline-secondary w-100 rounded-0 text-left"
          >
            <div className="d-flex flex-row w-100 justify-content-between">
              <h5 className="mb-1">
                {perks[perk_id].price} <small>Talent Tokens</small>
              </h5>
            </div>
            <p className="mb-1">{perks[perk_id].title}</p>
          </button>
        );
      })}
    </div>
  );
};

const Perks = () => {
  const [mode, setMode] = useState("view");

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
      {mode == "edit" && <EditPerk />}
      {mode == "view" && <ViewPerks />}
    </div>
  );
};

export default Perks;
