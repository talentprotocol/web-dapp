class API::V1::TokensController < ApplicationController
  before_action :set_token

  def show
    if @token
      render json: {
        id: @token.id,
        address: @token.contract_id,
        profilePictureUrl: @token.talent.profile_picture_url,
        variance7d: @token.variance7d.round(2).to_s(:delimited)
      }, status: :ok
    else
      render json: {error: "Not found."}, status: :not_found
    end
  end

  private

  def set_token
    @token = Token.find_by(contract_id: params[:id])
  end
end
