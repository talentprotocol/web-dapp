class API::V1::TalentController < ApplicationController
  def index
    service = Talents::Search.new(filter_params: filter_params.to_h, admin: current_user.admin?)
    talents = service.call

    render json: TalentBlueprint.render(talents.includes(:token, user: :investor), view: :normal, current_user_watchlist: current_user_watchlist), status: :ok
  end

  # public /
  def public_index
    talents =
      if token_id_params.present?
        Talent.joins(:token).includes(:user).where(tokens: {contract_id: token_id_params})
      else
        []
      end

    render json: TalentBlueprint.render(talents, view: :normal, current_user_watchlist: current_user_watchlist), status: :ok
  end

  # Public endpoint
  def show
    talent = Talent.joins(:token).find_by(token: {contract_id: params[:id]})

    if talent
      render json: TalentBlueprint.render(talent, view: :normal, current_user_watchlist: current_user_watchlist), status: :ok
    else
      render json: {error: "Not found."}, status: :not_found
    end
  end

  def update
    if !current_user.admin? && talent.id != current_user.talent&.id
      return render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end

    service = API::UpdateTalent.new(talent)
    service.call(talent_params, user_params, tag_params)

    if service.success
      CreateNotificationTalentChangedJob.perform_later(talent.user.followers.pluck(:follower_id), talent.user_id)
      render json: TalentBlueprint.render(talent, view: :extended, current_user_watchlist: current_user_watchlist), status: :ok
    else
      render json: {error: "Unable to update Talent."}, status: :unprocessable_entity
    end
  end

  private

  def talent
    @talent ||=
      if talent_id_param
        Talent.find(params[:id])
      else
        Talent.find_by!(public_key: params[:talent_id])
      end
  end

  def token_id_params
    params.require(:tokens)
  end

  def filter_params
    params.permit(:keyword, :status)
  end

  def user_params
    params.require(:user).permit(
      :display_name,
      :username,
      :profile_type
    )
  end

  def tag_params
    params.permit(tags: [])
  end

  def talent_params
    params.require(:talent).permit(
      :username,
      :display_name,
      :public,
      :disable_messages,
      :open_to_job_offers,
      profile: [
        :pronouns,
        :occupation,
        :location,
        :headline,
        :website,
        :video,
        :wallet_address,
        :email,
        :linkedin,
        :twitter,
        :telegram,
        :discord,
        :github,
        :gender,
        :ethnicity,
        :nationality,
        :based_in
      ],
      profile_picture_data: {},
      banner_data: {}
    )
  end
end
