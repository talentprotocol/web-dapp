class API::V1::TalentsController < ApplicationController
  def index
    latest_added_talents = base_talent
      .joins(:token)
      .where.not(token: {contract_id: nil})
      .order("token.deployed_at DESC")
      .limit(3)

    launching_soon_talents = base_talent
      .where(token: {contract_id: nil})
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

    if talents
      render json: {talents: talents.map { |talent| {id: talent.id, profilePictureUrl: talent.profile_picture_url, contractId: talent.token.contract_id, username: talent.user.username, name: talent.user.display_name || talent.user.username} }}, status: :ok
    else
      render json: {error: "Talents not found."}, status: :not_found
    end
  end

  private

  def base_talent
    @base_talent ||= Talent.where(public: true).includes([:user, :token])
  end
end
