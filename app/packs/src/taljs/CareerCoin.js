class CareerCoin {
  constructor(contract, networkId, master_account, account) {
    this.contract = contract
    this.networkId = networkId
    this.account = account
    this.master_account = master_account
    this.name = null
    this.symbol = null
    this.mintedCoins = null
    this.balance = null
  }

  async load() {
    await this.getName()
    await this.getSymbol()
    await this.getMintedCoins()
    await this.getBalance()
  }

  async getName() {
    if (this.name) {
      return this.name
    } else {
      this.name = await this.contract.methods.name().call()
      return this.name
    }
  }

  async initialMint() {
    const setup = await this.contract.methods
      .initialMint(100_000_000_000).send({ from: this.master_account })

    return setup
  }

  async buy(token, amount) {
    const mintedAmount = await this.contract.methods
      .tMint(token).send({ from: this.account, value: amount })

    return mintedAmount
  }

  async sell(token, amount) {
    return await this.contract.methods
      .tBurn(token).send({ from: this.account, value: amount })
  }

  async getSymbol() {
    if (this.symbol) {
      return this.symbol
    } else {
      this.symbol = await this.contract.methods.symbol().call()
      return this.symbol
    }
  }

  async getMintedCoins() {
    this.mintedCoins = await this.contract.methods.continuousSupply().call()

    return this.mintedCoins
  }

  async getBalance() {
    if (this.contract && this.account) {
      this.balance = await this.contract.methods.balanceOf(this.account).call()
      return this.balance
    }
    return 0;
  }
}

export default CareerCoin
