import React, { useState, useEffect } from "react";

import NFTCard from "src/components/design_system/cards/NFTCard";

import { LoadingPortfolio } from "../NewPortfolio";

const NFTs = ({ userNFT, chainAPI }) => {
  const [loading, setLoading] = useState(true);
  const [nftImages, setNFTImages] = useState({});

  useEffect(() => {
    chainAPI.getNFTImg(userNFT.tokenAddress, userNFT.id).then((imageURL) => {
      setNFTImages((prev) => ({ ...prev, userNFT: imageURL }));
      setLoading(false);
    });
  }, [userNFT]);

  const linkToNFT = (nft) => {
    const baseUrl = chainAPI.getEnvBlockExplorerUrls();

    return `${baseUrl}/token/${nft.tokenAddress}/instance/${nft.id}`;
  };

  if (loading) {
    return <LoadingPortfolio />;
  }

  return (
    <div className="d-flex flex-row flex-wrap py-4">
      <NFTCard
        imageUrl={nftImages.userNFT}
        address={userNFT.tokenAddress}
        tokenId={userNFT.id}
        creator={"Talent Protocol"}
        onClick={() => window.open(linkToNFT(userNFT))}
      />
    </div>
  );
};

export default NFTs;
