class API::V1::TalentsController < ApplicationController
  def index
    latest_added_talents = Talent
      .base
      .active
      .order("tokens.deployed_at DESC")
      .limit(3)

    launching_soon_talents = Talent
      .base
      .upcoming
      .order(created_at: :desc)
      .limit(3)

    render json: {
      latest_added_talents: latest_added_talents.map { |talent| {id: talent.id, profilePictureUrl: talent.profile_picture_url, contractId: talent.token.contract_id, username: talent.user.username, name: talent.user.display_name || talent.user.username} },
      launching_soon_talents: launching_soon_talents.map { |talent| {id: talent.id, profilePictureUrl: talent.profile_picture_url, contractId: talent.token.contract_id, username: talent.user.username, name: talent.user.display_name || talent.user.username} }
    }, status: :ok
  end

  def most_trendy
    contract_ids = params[:ids].split(",")
    talents = Talent
      .joins(:token, :user)
      .where(token: {contract_id: contract_ids})
      .where.not(user: {role: "admin"})
      .limit(3)

    if talents.length.positive?
      render json: {talents: talents.map { |talent| {id: talent.id, profilePictureUrl: talent.profile_picture_url, contractId: talent.token.contract_id, username: talent.user.username, name: talent.user.display_name || talent.user.username} }}, status: :ok
    else
      render json: {error: "Talents not found."}, status: :not_found
    end
  end
end
