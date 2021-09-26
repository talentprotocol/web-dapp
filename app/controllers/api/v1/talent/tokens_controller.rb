class API::V1::Talent::TokensController < ApplicationController
  def update
    if talent.id != current_user.talent.id
      return render json: {error: "You don't have access to perform that action"}, status: :unauthorized
    end

    if token.update(token_params)
      render json: token, status: :ok
    else
      render json: {error: "Unable to update Token"}, status: :unprocessable_entity
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

  def token
    @token ||= Token.find(params[:id])
  end

  def token_params
    params.require(:token).permit(
      :ticker,
      :contract_id,
      :deployed
    )
  end
end
