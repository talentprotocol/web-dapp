export const shortenAddress = (address) => {
  return `${address.substring(0, 5)}...${address.substring(
    address.length - 4,
    address.length
  )}`;
};
