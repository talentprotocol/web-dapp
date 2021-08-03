class Tal {
  constructor(contract, account, networkId) {
    this.contract = contract
    this.account = account
    this.networkId = networkId
  }

  async balance() {
    if (this.contract) {
      return await this.contract.methods.balanceOf(this.account).call()
    }
    return 0;
  }
}

export default Tal
