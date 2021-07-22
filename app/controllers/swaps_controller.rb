class SwapsController < ApplicationController
  before_action :set_coin, only: [:show]

  def show
    @coins = Coin.all
  end

  private

  def set_coin
    if params[:ticker]
      @coin = Coin.find_by(ticker: params[:ticker])
    end
  end
end
