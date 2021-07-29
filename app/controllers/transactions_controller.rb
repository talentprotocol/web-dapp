class TransactionsController < ApplicationController
  before_action :set_coin, only: [:create]

  def create
    service = CreateTransaction.new
    @transaction = service.call(coin: @coin, amount: transaction_params[:amount], investor: current_user.investor)

    if @transaction
      render json: {success: "Transaction successfully created."}, status: :created
    else
      render json: {error: "Unable to process transaction."}, status: :bad_request
    end
  end

  private

  def set_coin
    @coin ||= Coin.find_by!(id: params[:coin_id])
  end

  def transaction_params
    params.permit(:coin_id, :amount)
  end
end
