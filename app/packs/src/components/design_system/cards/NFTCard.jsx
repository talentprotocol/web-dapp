import React from "react";

import { Caption, P1 } from "src/components/design_system/typography";
import Button from "src/components/design_system/button";

const NFTCard = ({ imageUrl, address, tokenId, creator, onClick }) => {
  return (
    <div className="d-flex flex-column position-relative nft-card width-fit mr-4">
      <img src={imageUrl} className="nft-image m-1" />
      <div className="d-flex flex-row align-items-center mx-4 mb-3">
        <div className="d-flex flex-column mr-4">
          <Caption className="text-primary mt-4 mb-1" text="Contract Address" />
          <P1 bold className="text-black mb-4">
            {`${address.substring(0, 10)}...`}
          </P1>
        </div>
        <div className="d-flex flex-column">
          <Caption className="text-primary mt-4 mb-1 mx-4" text="Token ID" />
          <P1 bold className="text-black mb-4 mx-4">
            {tokenId}
          </P1>
        </div>
      </div>
      <div className="d-flex flex-row justify-content-between align-items-end mx-4 mb-3">
        <div className="d-flex flex-column">
          <Caption className="text-primary mb-1" text="Creator" />
          <P1 bold className="text-black">
            {creator}
          </P1>
        </div>
        <Button onClick={onClick} type="white-ghost" className="text-primary">
          See Details {">"}
        </Button>
      </div>
    </div>
  );
};

export default NFTCard;
