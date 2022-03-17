import React from "react";

import { P1, P3 } from "src/components/design_system/typography";
import { Caret, Copy } from "src/components/icons";
import Link from "src/components/design_system/link";
import Button from "src/components/design_system/button";
import Tooltip from "src/components/design_system/tooltip";

import { shortenAddress } from "src/utils/viewHelpers";

const NFTCard = ({ imageUrl, address, tokenId, href, mode }) => {
  const copyAddress = () => navigator.clipboard.writeText(address);
  return (
    <div className="d-flex flex-column position-relative nft-card width-fit mr-lg-4">
      <img src={imageUrl} className="nft-image m-1" />
      <div className="d-flex flex-row align-items-center mx-4 mb-2">
        <div className="d-flex flex-column mr-4">
          <P3 className="text-primary-04 mt-4 mb-1" text="Contract Address" />
          <div className="d-flex flex-row align-items-center">
            <P1 bold className="text-black">
              {shortenAddress(address)}
            </P1>
            <Tooltip
              body={"Copied!"}
              popOverAccessibilityId={"coppy_address_success"}
              mode={mode}
              placement="top"
            >
              <Button type="white-ghost" className="ml-2" onClick={copyAddress}>
                <Copy color="currentColor" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="d-flex flex-row justify-content-between align-items-end mx-4 mb-4">
        <div className="d-flex flex-column">
          <P3 className="text-primary-04 mb-1" text="Token ID" />
          <P1 bold className="text-black">
            {tokenId}
          </P1>
        </div>
        <Link
          className="d-flex align-items-center"
          bold
          href={href}
          target="_blank"
          text="See Details"
        >
          <Caret size={12} color="currentColor" className="rotate-270 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default NFTCard;
