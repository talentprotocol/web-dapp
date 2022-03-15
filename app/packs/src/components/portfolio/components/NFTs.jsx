import React, { useState } from "react";

import { LoadingPortfolio } from "../NewPortfolio";

const NFTs = () => {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingPortfolio />;
  }
  return <h1>NFTs!</h1>;
};

export default NFTs;
