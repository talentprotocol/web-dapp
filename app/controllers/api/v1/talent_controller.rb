class API::V1::TalentController < ApplicationController
  def show
    @talent = Talent.joins(:token).find_by(token: {contract_id: params[:id]})

    if @talent
      render json: {id: @talent.id, profilePictureUrl: @talent.profile_picture_url}, status: :ok
    else
      render json: {error: "Not found."}, status: :not_found
    end
  end

  def update
    if talent.id != current_user.talent.id
      return render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end

    service = API::UpdateTalent.new(talent)
    service.call(talent_params)

    if service.success
      render json: service.talent, status: :ok
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

  def talent_params
    params.require(:talent).permit(
      :username,
      :display_name,
      :primary_tag,
      :secondary_tags,
      :public,
      :disable_messages,
      profile: [:pronouns, :occupation, :location, :headline, :website, :video, :wallet_address, :email, :linkedin, :twitter, :telegram, :discord, :github],
      profile_picture: {},
      banner: {}
    )
  end
end
