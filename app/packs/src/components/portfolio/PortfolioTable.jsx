import React from 'react'
import Button from '../button'
import DisplayCoinVariance from '../coin/DisplayCoinVariance'
import TalentProfilePicture from '../talent/TalentProfilePicture'

const EmptyInvestments = () => (
  <tr>
    <td className="align-middle text-muted" colspan="7"><small>Sponsor Talent to start building your portfolio.</small></td>
    <td className="align-middle" colspan="1"><Button type="primary" text="See Talents" href="/talent" size="sm"/></td>
  </tr>
)

const PortfolioTable = ({ transactions }) => {
  return (
    <div className="table-responsive border-bottom border-left border-right">
      <table className="table table-hover mb-0">
        <thead>
          <tr>
            <th className="tal-th py-1 text-muted border-bottom-0" scope="col"><small>Talent</small></th>
            <th className="tal-th py-1 text-muted border-bottom-0" scope="col"></th>
            <th className="tal-th py-1 text-muted border-bottom-0" scope="col"><small>Name</small></th>
            <th className="tal-th py-1 text-muted border-bottom-0 text-right" scope="col"><small>Amount Held</small></th>
            <th className="tal-th py-1 text-muted border-bottom-0 text-right" scope="col"><small>Coin Value</small></th>
            <th className="tal-th py-1 text-muted border-bottom-0 text-right" scope="col"><small>Total</small></th>
            <th className="tal-th py-1 text-muted border-bottom-0 text-right" scope="col"><small>7d %</small></th>
            <th className="tal-th py-1 text-muted border-bottom-0" scope="col"><small>Actions</small></th>
          </tr>
        </thead>
        <tbody>
          {transactions.length == 0 && <EmptyInvestments />}
          {transactions.map((transaction) => (
            <tr key={`transaction-${transaction.id}`}className="tal-tr-item">
              <th className="align-middle pr-0" scope="row">
                <TalentProfilePicture src={transaction.profilePictureUrl} height={40}/>
              </th>
              <th className="text-primary align-middle pl-0" scope="row">{transaction.coinTicker}</th>
              <td className="align-middle">{transaction.talentName}</td>
              <td className="align-middle text-right">{transaction.amount}</td>
              <td className="align-middle tal-table-price text-right">
                {transaction.price}
                <br/>
                <span className="text-muted"><small>{transaction.priceInTal}</small></span>
              </td>
              <td className="align-middle tal-table-price text-right">
                {transaction.value}
                <br/>
                <span className="text-muted"><small>{transaction.valueInTal}</small></span>
              </td>
              <td className="align-middle text-right"><DisplayCoinVariance variance={transaction.priceVariance7d}/></td>
              <td className="align-middle"><Button type="primary" text="View" href={transaction.talentUrl} size="sm"/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PortfolioTable