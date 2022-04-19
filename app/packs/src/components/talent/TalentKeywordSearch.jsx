import React from "react";
import TextInput from "src/components/design_system/fields/textinput";
import { Search } from "src/components/icons";

const TalentKeywordSearch = ({ keyword, setKeyword, filter, className }) => {
  return (
    <form onSubmit={(e) => filter(e, "keyword", keyword)} className={className}>
      <div className="position-relative">
        <TextInput
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
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

export default TalentKeywordSearch;
