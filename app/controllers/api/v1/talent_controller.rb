class API::V1::TalentController < ApplicationController
  def update
    if talent.id != current_user.talent.id
      return render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end

    service = API::UpdateTalent.new(talent)
    service.call(talent_params)

    if service.success
      render json: service.talent, status: :ok
    else
      render json: {error: "Unable to update Token"}, status: :unprocessable_entity
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
      profile: [:pronouns, :ocupation, :location, :headline, :website, :video, :wallet_address, :email, :linkedin, :twitter, :telegram, :discord, :github],
      profile_picture: {}
    )
  end
end
