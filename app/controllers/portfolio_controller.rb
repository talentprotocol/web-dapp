class PortfolioController < ApplicationController
  def index
    @pagy, @transactions = pagy(current_user.investor.transactions.includes([token: [talent: :user]]).order(id: :desc) || Transaction.none)
  end
end
