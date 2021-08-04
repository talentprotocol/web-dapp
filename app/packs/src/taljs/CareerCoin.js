class CareerCoin {
  constructor(contract, networkId) {
    this.contract = contract
    this.networkId = networkId
    this.name = null
    this.symbol = null
    this.mintedCoins = null
  }

  async load() {
    await this.getName()
    await this.getSymbol()
    await this.getMintedCoins()
  }

  async getName() {
    if (this.name) {
      return this.name
    } else {
      this.name = await this.contract.methods.name().call()
      return this.name
    }
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
}

export default CareerCoin
