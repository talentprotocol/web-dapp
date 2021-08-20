class Portfolio::TokensController < ApplicationController
  before_action :set_token, only: [:show]

  def show
    @pagy, @transactions =
      pagy(
        @token.transactions.where(investor: current_user.investor)
          .includes([token: [talent: :user]])
          .order(id: :desc) || Transaction.none
      )
  end

  private

  def set_token
    @token = Token.find(params[:id])
  end
end
