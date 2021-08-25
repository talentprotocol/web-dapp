class Tal {
  constructor(contract, account, networkId) {
    this.contract = contract;
    this.account = account;
    this.networkId = networkId;
    this.balance = null;
    this.symbol = "$TAL";
    this.price = 0.02;
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
      try {
        return await this.contract.methods
          .approve(address, amount)
          .send({ from: this.account });
      } catch {
        return false;
      }
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

  async transfer(address, amount) {
    if (this.contract && this.account) {
      return await this.contract.methods
        .transfer(address, amount)
        .send({ from: this.account });
    }

    return false;
  }
}

export default Tal;
