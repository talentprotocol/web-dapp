import { ethers } from "ethers";
import { parseAndCommify } from "src/onchain/utils";

export const shortenAddress = (address) => {
  return `${address.substring(0, 5)}...${address.substring(
    address.length - 4,
    address.length
  )}`;
};

export const getSupporterCount = (supporterCounter) => {
  if (supporterCounter) {
    return ethers.utils.commify(supporterCounter);
  }
  return "-1";
};

export const getMarketCap = (totalSupply) => {
  if (totalSupply) {
    const formattedTotalSupply = ethers.utils.formatUnits(totalSupply);

    return parseAndCommify(formattedTotalSupply * 0.1);
  }
  return "-1";
};

export const getProgress = (totalSupply, maxSupply) => {
  const value = ethers.BigNumber.from(totalSupply)
    .mul(100)
    .div(maxSupply)
    .toNumber();

  if (value < 1) {
    return 1;
  } else {
    return value;
  }
};

export const getMarketCapVariance = (
  tokenDayData,
  deployDate,
  startDate,
  totalSupply
) => {
  if (startDate < deployDate || !tokenDayData[0]) {
    return 0;
  }

  const startSupply = parseFloat(
    ethers.utils.formatUnits(tokenDayData[0].dailySupply)
  );
  const lastSupply = parseFloat(ethers.utils.formatUnits(totalSupply));
  return (lastSupply - startSupply) / startSupply;
};

export const parsedVariance = (variance) => {
  if (Math.abs(variance) < 0.01) return "0%";

  let parsedVariance = `${parseAndCommify(variance)}%`;

  if (variance > 0) {
    parsedVariance = `+${parsedVariance}`;
  }

  return parsedVariance;
};

export const getStartDateForVariance = () => {
  const varianceDays = 30;
  const msDividend = 1000;
  const dayInSeconds = 86400;
  const currentDate = new Date();
  const endDate =
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate(),
      0,
      0,
      0
    ) / msDividend;
  const startDate = endDate - varianceDays * dayInSeconds;
  return startDate;
};

export const getUTCDate = (date) => {
  const msDividend = 1000;
  const deployDate = new Date(date);
  const deployDateUTC =
    Date.UTC(
      deployDate.getUTCFullYear(),
      deployDate.getUTCMonth(),
      deployDate.getUTCDate(),
      0,
      0,
      0
    ) / msDividend;

  return deployDateUTC;
};
