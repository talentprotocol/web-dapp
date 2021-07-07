class Admin::Talent::RewardsController < ApplicationController
  before_action :set_talent
  before_action :set_reward, only: [:show, :edit, :update, :destroy]

  def index
    @rewards = @talent.rewards
  end

  def show
  end

  def new
    @reward = @talent.rewards.new
  end

  def create
    @reward = @talent.rewards.new(reward_params)

    if @reward.save
      redirect_to(
        admin_talent_rewards_path(@talent),
        notice: "Reward successfully created."
      )
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @reward.update(reward_params)
      redirect_to(
        admin_talent_rewards_path(@talent),
        notice: "Reward successfully updated."
      )
    else
      render :edit
    end
  end

  def destroy
    if @reward.destroy
      redirect_to(
        admin_talent_rewards_path(@talent),
        notice: "Reward successfully destroyed."
      )
    else
      render :show
    end
  end

  private

  def set_talent
    @talent =
      if talent_id_param > 0
        Talent.find(params[:talent_id])
      else
        Talent.find_by!(public_key: params[:talent_id])
      end
  end

  def set_reward
    @reward = Reward.find(params[:id])
  end

  def reward_params
    params.require(:reward).permit(
      :description,
      :required_amount
    )
  end
end
