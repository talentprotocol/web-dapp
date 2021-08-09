import React, { useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

import { post } from "src/utils/requests"

const CoinSelection = ({ uniqueId, selectedCoin, coins, setCoin }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle className="tal-nav-dropdown-btn" variant="primary" id="dropdown-basic">
        {selectedCoin.ticker || "Select"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {coins.map((otherCoin) =>
          <Dropdown.Item key={`${uniqueId}-${otherCoin.ticker}`} onClick={() => setCoin(otherCoin)}>{otherCoin.ticker}</Dropdown.Item>)}
      </Dropdown.Menu>
    </Dropdown>
  )
}

// given coinA amount, how much coinB do you get
const calculateComplementValue = (amount, coinA, coinB) => {
  if(coinA.ticker == "$TAL") {
    return amount * coinB.exchangeRate
  } else if(coinB.ticker == "$TAL") {
    return amount / coinA.exchangeRate
  } else {
    // convert to tal then to other coin
    return (amount / coinA.exchangeRate) * coinB.exchangeRate
  }
}

const Swap = ({ coins, coin, tal }) => {
  const [inputAmount, setInputAmount] = useState("")
  const [outputAmount, setOutputAmount] = useState("")
  const [inputCoin, setInputCoin] = useState(tal)
  const [outputCoin, setOutputCoin] = useState(coin.ticker ? coin : { balance: 0.0 })

  const onTextChange = ({value, coin, coinChange, max, otherCoin, otherCoinChange}) => {
    if(/^[0-9]*[.,]?[0-9]*$/.test(value)) {
      if(parseFloat(value) > max) {
        coinChange(max)
        if(otherCoin.ticker) {
          otherCoinChange(calculateComplementValue(max, coin, otherCoin))
        }
      } else {
        coinChange(value)
        if(otherCoin.ticker) {
          otherCoinChange(calculateComplementValue(value, coin, otherCoin))
        }
      }
    }
  }

  const buttonDisabled = () => !(parseFloat(inputAmount) > 0.0 && parseFloat(outputAmount) > 0.0)

  const onSubmit = (e) => {
    e.preventDefault()
    console.log("Trading..")

    if(inputCoin.ticker == "$TAL") {
      post(
        `/transactions`,
        { coin_id: outputCoin.coinId, amount: parseFloat(outputAmount) }
      ).then((response) => {
        if(response.error) {
          console.log(response.error)
        } else {
          setInputAmount("")
          setOutputAmount("")
        }
      })
    } else if(outputCoin.ticker == "$TAL") {
      post(
        `/transactions`,
        { coin_id: inputCoin.coinId, amount: -parseFloat(inputAmount) }
      ).then((response) => {
        if(response.error) {
          console.log(response.error)
        } else {
          setInputAmount("")
          setOutputAmount("")
        }
      })
    } else {
      post(
        `/transactions`,
        { coin_id: inputCoin.coinId, amount: -parseFloat(inputAmount) }
      ).then((response) => {
        if(response.error) {
          console.log(response.error)
        } else {
          setInputAmount("")
          setOutputAmount("")
        }
      })

      post(
        `/transactions`,
        { coin_id: outputCoin.coinId, amount: parseFloat(outputAmount) }
      ).then((response) => {
        if(response.error) {
          console.log(response.error)
        } else {
          setInputAmount("")
          setOutputAmount("")
        }
      })
    }
  }

  const onInputCoinSet = (selectedCoin) => {
    // switch coins
    if(selectedCoin.ticker == outputCoin.ticker) {
      setOutputCoin(inputCoin)
    }
    setInputCoin(selectedCoin)
    setInputAmount("")
    setOutputAmount("")
  }

  const onOutputCoinSet = (selectedCoin) => {
    // switch coins
    if(selectedCoin.ticker == inputCoin.ticker) {
      setInputCoin(outputCoin)
    }
    setOutputCoin(selectedCoin)
    setOutputAmount("")
    setInputAmount("")
  }

  return (
    <section className="col-12 mx-auto d-flex flex-column justify-content-center lg-overflow-y-scroll pt-3 h-100">
      <form onSubmit={onSubmit} className="d-flex flex-column border rounded-sm p-4 mx-auto registration-box" style={{maxWidth: 500}}>
        <h5 className="text-center">Talent DEX</h5>
        <div className="d-flex flex-column justify-content-between align-items-center border rounded-sm px-3 py-2">
          <CoinSelection selectedCoin={inputCoin} coins={[tal, ...coins]} setCoin={onInputCoinSet} uniqueId="input-swap"/>
          <div className="d-flex flex-column align-items-end form-group mb-0">
            <input
              className="text-right form-control ml-2 mt-2 bt-md-0"
              inputMode="decimal"
              type="text"
              placeholder="0.0"
              minLength="1"
              maxLength="79"
              onChange={(e) =>
                onTextChange({
                  value: e.target.value,
                  coin: inputCoin,
                  coinChange: setInputAmount,
                  max: inputCoin.balance,
                  otherCoin: outputCoin,
                  otherCoinChange: setOutputAmount
                })
              }
              value={inputAmount}/>
            <small className="text-muted">Balance {inputCoin.balance || 0.0}</small>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-between align-items-center mt-2 border rounded-sm px-3 py-2">
          <CoinSelection selectedCoin={outputCoin} coins={[tal, ...coins]} setCoin={onOutputCoinSet} uniqueId="output-swap"/>
          <div className="d-flex flex-column align-items-end form-group mb-0">
            <input
              className="text-right form-control ml-md-2 mt-2 bt-md-0"
              inputMode="decimal"
              type="text"
              placeholder="0.0"
              minLength="1"
              maxLength="79"
              onChange={(e) =>
                onTextChange({
                  value: e.target.value,
                  coin: outputCoin,
                  coinChange: setOutputAmount,
                  max: outputCoin.balance,
                  otherCoin: inputCoin,
                  otherCoinChange: setInputAmount
                })
              }
              value={outputAmount}/>
            <small className="text-muted">Balance {outputCoin.balance}</small>
          </div>
        </div>
        <button type="submit" disabled={buttonDisabled()} className="btn btn-primary talent-button mt-3">Trade</button>
      </form>
    </section>
  )
}

export default Swap
