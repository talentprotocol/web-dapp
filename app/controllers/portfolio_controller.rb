class PortfolioController < ApplicationController
  def show
    token_ids = current_user.investor.transactions.distinct.pluck(:token_id)

    @tokens = Token.where(id: token_ids).order(id: :desc)

    @pagy, @tokens = pagy(@tokens || Transaction.none)
  end
end
