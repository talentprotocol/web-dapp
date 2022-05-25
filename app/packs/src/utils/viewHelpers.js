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
  endDate
) => {
  const supplies = [];
  const dayData = {};
  const dayInSeconds = 86400;

  tokenDayData.forEach((data) => {
    dayData[data.date] = parseFloat(ethers.utils.formatUnits(data.dailySupply));
  });

  for (let date = startDate, i = 0; date < endDate; date += dayInSeconds) {
    if (date < deployDate) {
      supplies.push(0);
    } else if (dayData[date]) {
      supplies.push(dayData[date]);
    } else {
      supplies.push(supplies[i - 1]);
    }
    i++;
  }
  const totalSupply = supplies.reduce((prev, current) => prev + current, 0);
  const mean = totalSupply / supplies.length;

  const sumForVariance = supplies.reduce(
    (prev, current) => prev + Math.pow(current - mean, 2),
    0
  );
  const variance = sumForVariance / supplies.length;
  const marketCapVariance = parseAndCommify(variance * 0.1);
  return marketCapVariance;
};
