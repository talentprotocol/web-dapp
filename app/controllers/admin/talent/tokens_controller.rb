class Admin::Talent::TokensController < ApplicationController
  def show
    talent
    token
  end

  def edit
    talent
    token
  end

  def update
    if token.update(token_params)
      respond_to do |format|
        format.html do
          redirect_to(
            admin_user_path(token.talent.user),
            flash: {success: "Talent's token successfully updated."}
          )
        end
        format.json { render json: {success: "Talent's token successfully updated."}, status: :ok }
      end
    else
      render :edit
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
      :price,
      :ticker,
      :reserve_ratio,
      :talent_fee,
      :contract_id,
      :deployed
    )
  end
end
