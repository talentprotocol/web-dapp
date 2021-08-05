class Talent::RewardsController < ApplicationController
  def create
    if talent.id != current_user.talent.id
      return render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end

    @reward = Reward.new(reward_params)
    @reward.talent = talent
    unless @reward.required_amount.present?
      @reward.required_amount = 0
    end

    if @reward.save
      render json: {id: @reward.id, required_amount: @reward.required_amount, display_required_amount: @reward.required_amount&.to_s(:delimited), description: @reward.description, required_text: @reward.required_text}, status: :created
    else
      render json: {error: "Unable to create Reward"}, status: :unprocessable_entity
    end
  end

  def update
    if talent.id != current_user.talent.id
      return render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end

    if reward.update(reward_params)
      unless reward.required_amount.present?
        reward.update!(required_amount: 0)
      end
      render json: {id: reward.id, required_amount: reward.required_amount, display_required_amount: reward.required_amount&.to_s(:delimited), description: reward.description, required_text: reward.required_text}, status: :ok
    else
      render json: {error: "Unable to update Reward"}, status: :unprocessable_entity
    end
  end

  private

  def talent
    @talent ||=
      if talent_id_param
        Talent.find(params[:talent_id])
      else
        Talent.find_by!(public_key: params[:talent_id])
      end
  end

  def reward
    @reward ||= Reward.find(params[:id])
  end

  def reward_params
    params.require(:reward).permit(
      :description,
      :required_amount,
      :required_text
    )
  end
end
