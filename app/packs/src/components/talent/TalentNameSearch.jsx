import React, { useState } from "react";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TalentNameSearch = () => {
  const url = new URL(document.location);
  const [name, setName] = useState(url.searchParams.get("filter") || "");

  const onSubmit = (e) => {
    e.preventDefault();

    url.searchParams.set("filter", name);
    if (url.searchParams.has("page")) {
      url.searchParams.delete("page");
    }
    window.location.href = url.toString();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group position-relative">
        <button
          type="submit"
          disabled={name.length == 0}
          className="btn btn-outline-secondary talent-button border-0 talent-search-icon"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Search talent.."
          className="form-control bg-transparent pl-5 rounded-sm"
        />
      </div>
    </form>
  );
};

export default TalentNameSearch;
