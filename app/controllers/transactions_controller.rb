class TransactionsController < ApplicationController
  def create
    service = CreateTransaction.new

    @transaction = service.call(
      amount: transaction_params[:amount],
      block_id: transaction_params[:block_id],
      token_address: transaction_params[:token_address],
      transaction_id: transaction_params[:transaction_id],
      inbound: transaction_params[:inbound],
      user_id: current_user.id
    )

    if @transaction
      render json: {success: "Transaction successfully created."}, status: :created
    else
      render json: {error: "Unable to process transaction."}, status: :bad_request
    end
  end

  private

  def transaction_params
    params.permit(:token_address, :amount, :transaction_id, :block_id, :inbound)
  end
end
