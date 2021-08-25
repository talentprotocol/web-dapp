class TalentToken {
  constructor(contract, networkId, master_account, account) {
    this.contract = contract;
    this.networkId = networkId;
    this.account = account;
    this.master_account = master_account;
    this.name = null;
    this.symbol = null;
    this.mintedTokens = null;
    this.reserve = null;
    this.balance = null;
    this.tokenValue = null;
  }

  async load() {
    await this.getName();
    await this.getSymbol();
    await this.getMintedTokens();
    await this.getReserve();
    await this.getBalance();
    this.calculateTokenValue();
  }

  calculateTokenValue() {
    this.tokenValue =
      (1.0 * parseInt(this.reserve)) / parseInt(this.mintedTokens);
  }

  async getReserve() {
    if (this.reserve) {
      return this.reserve;
    } else {
      this.reserve = await this.contract.methods.reserveBalance().call();
      return this.reserve;
    }
  }

  async getName() {
    if (this.name) {
      return this.name;
    } else {
      this.name = await this.contract.methods.name().call();
      return this.name;
    }
  }

  async initialMint() {
    const setup = await this.contract.methods
      .initialMint(1000)
      .send({ from: this.master_account });

    return setup;
  }

  async simulateBuy(amount) {
    const estimatedReward = await this.contract.methods
      .calculateReward(amount)
      .call();

    return estimatedReward;
  }

  async buy(amount, onSuccess, onError, onTransactionHash) {
    const result = await this.contract.methods
      .mintFromTal(amount)
      .send({ from: this.account })
      .on("transactionHash", (hash) => onTransactionHash(hash))
      .on("receipt", (receipt) => onSuccess(receipt))
      .on("error", (e) => onError(e));

    return result;
  }

  async simulateSell(amount) {
    const estimatedRefund = await this.contract.methods
      .calculateRefund(amount)
      .call();

    return estimatedRefund;
  }

  async sell(amount, onSuccess, onError, onTransactionHash) {
    const burnedAmount = await this.contract.methods
      .burnToTal(amount)
      .send({ from: this.account })
      .on("transactionHash", (hash) => onTransactionHash(hash))
      .on("receipt", (receipt) => onSuccess(receipt))
      .on("error", (e) => onError(e));

    return burnedAmount;
  }

  async getSymbol() {
    if (this.symbol) {
      return this.symbol;
    } else {
      this.symbol = await this.contract.methods.symbol().call();
      return this.symbol;
    }
  }

  async getMintedTokens() {
    this.mintedTokens = await this.contract.methods.continuousSupply().call();

    return this.mintedTokens;
  }

  async getBalance() {
    if (this.contract && this.account) {
      this.balance =
        (await this.contract.methods.balanceOf(this.account).call()) / 100.0;
      return this.balance;
    }
    return 0;
  }
}

export default TalentToken;
