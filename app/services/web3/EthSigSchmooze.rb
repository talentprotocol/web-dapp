require "schmooze"

module Web3
  class EthSigSchmooze < Schmooze::Base
    dependencies ethUtil: "ethereumjs-util"
    dependencies sigUtil: "eth-sig-util"

    method :getSignerAccount, "function(msg, sig) { return sigUtil.recoverPersonalSignature({ data: msg, sig: sig }) }"
  end
end
