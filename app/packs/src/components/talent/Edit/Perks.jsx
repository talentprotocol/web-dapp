import React, { useState, useMemo } from "react";
import dayjs from "dayjs";

import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";
import TextInput from "src/components/design_system/fields/textinput";
import Button from "src/components/design_system/button";
import Perk from "src/components/design_system/cards/perk";

const Perks = ({ railsContext, mode, ...props }) => {
  const { perks, token, mobile } = props;
  const [selectedPerkId, setSelectedPerkId] = useState(null);
  const [perk, setPerk] = useState({
    id: "",
    title: "",
    price: "",
    description: "",
  });

  const changeAttribute = (attribute, value) => {
    setPerk((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  const changePerk = (id) => {
    setSelectedPerkId(id);

    const selectedPerk = milestones.find((milestone) => milestone.id == id);

    setPerk({
      id: selectedPerk.id,
      title: selectedPerk.title,
      price: selectedPerk.price,
      description: selectedPerk.description,
    });
  };

  return (
    <>
      <H5 className="w-100 text-left" mode={mode} text="Perks" bold />
      <P2
        className="w-100 text-left"
        mode={mode}
        text="Describe what your tokens holders will have access to."
      />
      <div className="d-flex flex-row w-100 justify-content-between mt-4">
        <TextInput
          title={"Title"}
          mode={mode}
          placeholder={"Social Media, Streaming, Consultant..."}
          onChange={(e) => changeAttribute("title", e.target.value)}
          value={perk["title"]}
          className={"w-100"}
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={"Description"}
          mode={mode}
          shortCaption="Describe the perk"
          onChange={(e) => changeAttribute("description", e.target.value)}
          value={perk["description"]}
          className="w-100"
          maxLength={240}
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={`Amount ${token.ticker}`}
          type="number"
          mode={mode}
          placeholder={"0,000.00"}
          shortCaption={
            "Amount of talent tokens the supporter must hold to redeem this perk."
          }
          onChange={(e) => changeAttribute("amount", e.target.value)}
          value={perk["amount"]}
          className="w-100"
        />
      </div>
      <Button
        onClick={() => console.log("saving")}
        type="white-ghost"
        mode={mode}
        className="text-primary w-100 my-3"
      >
        + Add another Perk
      </Button>
      {perks.map((perk, index) => (
        <Perk
          key={`perk_list_${perk.id}`}
          mode={mode}
          area={"General"}
          title={perk.title}
          my_tokens={0}
          tokens={parseFloat(perk.price)}
          ticker={token.ticker}
          hideAction={true}
          className={"w-100 mb-3"}
        />
      ))}
    </>
  );
};

export default Perks;
