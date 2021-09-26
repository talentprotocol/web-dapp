class API::V1::Talent::ServicesController < ApplicationController
  before_action :validate_access

  def update
    if service.update(service_params)
      render json: service, status: :ok
    else
      render json: {error: "Unable to update Service"}, status: :unprocessable_entity
    end
  end

  def create
    @service = Service.new(service_params)
    @service.talent = talent

    if @service.save
      render json: @service, status: :created
    else
      render json: {error: "Unable to create Service"}, status: :unprocessable_entity
    end
  end

  def destroy
    if service.destroy
      render json: service, status: :ok
    else
      render json: {error: "Unable to delete requested service."}, status: :unprocessable_entity
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

  def service
    @service ||= Service.find(params[:id])
  end

  def service_params
    params.require(:service).permit(
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
