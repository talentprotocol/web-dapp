import React, { useState } from "react";
import { get } from "src/utils/requests";

import TextInput from "src/components/design_system/fields/textinput";
import { Search } from "src/components/icons";

const TalentNameSearch = ({ setLocalTalents }) => {
  const url = new URL(document.location);
  const [name, setName] = useState(url.searchParams.get("filter") || "");

  const onSubmit = (e) => {
    e.preventDefault();

    url.searchParams.set("filter", name);
    get(`/api/v1/talent?${url.searchParams.toString()}`).then((response) => {
      setLocalTalents(response.talents);
      window.history.pushState(
        {},
        document.title,
        name ? `${url.pathname}?filter=${name}` : url.pathname
      );
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="position-relative">
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Search"
          inputClassName="pl-5"
          className="w-100"
        />
        <Search
          color="currentColor"
          className="position-absolute chat-search-icon"
        />
      </div>
    </form>
  );
};

export default TalentNameSearch;
