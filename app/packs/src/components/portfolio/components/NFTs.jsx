import React, { useState, useEffect } from "react";

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

  console.log(nftImages);
  if (loading) {
    return <LoadingPortfolio />;
  }
  return (
    <>
      <h1>NFTs!</h1>
      <img src={nftImages.userNFT} width="100" height="100" />
    </>
  );
};

export default NFTs;
