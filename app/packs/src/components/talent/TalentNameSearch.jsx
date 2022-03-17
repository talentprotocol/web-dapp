import React from "react";
import TextInput from "src/components/design_system/fields/textinput";
import { Search } from "src/components/icons";

const TalentNameSearch = ({ name, setName, filter, className }) => {
  return (
    <form onSubmit={(e) => filter(e, "name", name)} className={className}>
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
