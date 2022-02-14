class API::V1::TalentsController < ApplicationController
  def index
    contract_ids = params[:ids].split(",")
    talents = Talent
      .joins(:token, :user)
      .where(token: {contract_id: contract_ids})
      .where.not(user: {role: "admin"})
      .limit(3)

    if talents
      render json: {talents: talents.map { |talent| {id: talent.id, profilePictureUrl: talent.profile_picture_url, contractId: talent.token.contract_id, username: talent.user.username, name: talent.user.display_name || talent.user.username} }}, status: :ok
    else
      render json: {error: "Talents not found."}, status: :not_found
    end
  end
end
