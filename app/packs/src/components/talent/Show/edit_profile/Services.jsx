import React, { useState } from "react";

import { patch } from "src/utils/requests";

import Button from "../../../button";

const EditService = () => {
  const [servicesInfo, setServicesInfo] = useState({
    title: "",
    price: "",
  });

  const changeAttribute = (attribute, value) => {
    setServicesInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  return (
    <form>
      <div className="form-group">
        <label htmlFor="title">Price</label>
        <input
          id="price"
          className="form-control"
          placeholder="Amount of your Talent Token required"
          value={servicesInfo["price"]}
          onChange={(e) => changeAttribute("price", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          className="form-control"
          placeholder="Describe the service"
          value={servicesInfo["title"]}
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

const ViewServices = () => {
  const services = { 1: { id: 1, title: "hello", price: "123" } };

  return (
    <div className="d-flex flex-column mt-3">
      {Object.keys(services).length == 0 && (
        <li className="list-group-item">
          <small className="text-muted">
            Start by creating your first service!
          </small>
        </li>
      )}
      {Object.keys(services).map((service_id) => {
        return (
          <button
            key={`service_${service_id}`}
            className="btn btn-outline-secondary w-100 rounded-0 text-left"
          >
            <div className="d-flex flex-row w-100 justify-content-between">
              <h5 className="mb-1">
                {services[service_id].price} <small>Talent Tokens</small>
              </h5>
            </div>
            <p className="mb-1">{services[service_id].title}</p>
          </button>
        );
      })}
    </div>
  );
};

const Services = () => {
  const [mode, setMode] = useState("view");

  return (
    <div className="col-md-8 mx-auto d-flex flex-column my-3">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <h4>Services</h4>
        {mode != "edit" && (
          <Button
            type="primary"
            text="Add Service"
            onClick={() => setMode("edit")}
          />
        )}
      </div>
      {mode == "edit" && <EditService />}
      {mode == "view" && <ViewServices />}
    </div>
  );
};

export default Services;
