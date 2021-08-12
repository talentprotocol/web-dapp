class Tal {
  constructor(contract, account, networkId) {
    this.contract = contract;
    this.account = account;
    this.networkId = networkId;
    this.balance = null;
    this.symbol = "$TAL";
  }

  async getBalance() {
    if (this.contract && this.account) {
      this.balance =
        (await this.contract.methods.balanceOf(this.account).call()) / 100.0;
      return this.balance;
    }
    return 0;
  }

  async approve(address, amount) {
    if (this.contract && this.account) {
      return await this.contract.methods
        .approve(address, amount)
        .send({ from: this.account });
    }

    return false;
  }

  async allowance(address) {
    if (this.contract && this.account) {
      return await this.contract.methods
        .allowance(this.account, address)
        .call();
    }

    return 0;
  }
}

export default Tal;
