class API::V1::Talent::PerksController < ApplicationController
  before_action :validate_access

  def update
    if perk.update(perk_params)
      render json: perk, status: :ok
    else
      render json: {error: "Unable to update perk"}, status: :unprocessable_entity
    end
  end

  def create
    @perk = Perk.new(perk_params)
    @perk.talent = talent

    if @perk.save
      render json: @perk, status: :created
    else
      render json: {error: "Unable to create perk"}, status: :unprocessable_entity
    end
  end

  def destroy
    if perk.destroy
      render json: perk, status: :ok
    else
      render json: {error: "Unable to delete requested perk."}, status: :unprocessable_entity
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

  def perk
    @perk ||= Perk.find(params[:id])
  end

  def perk_params
    params.require(:perk).permit(
      :price,
      :title
    )
  end

  def validate_access
    if talent.id != current_user.talent.id
      render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end
  end
end
