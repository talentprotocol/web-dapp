class Admin::Talent::CoinsController < ApplicationController
  def show
    talent
    coin
  end

  def edit
    talent
    coin
  end

  def update
    if coin.update(coin_params)
      respond_to do |format|
        format.html do
          redirect_to(
            admin_user_path(coin.talent.user),
            flash: {success: "Talent's coin successfully updated."}
          )
        end
        format.json { render json: {success: "Talent's coin successfully updated."}, status: :ok }
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

  def coin
    @coin ||= Coin.find(params[:id])
  end

  def coin_params
    params.require(:coin).permit(
      :price,
      :ticker,
      :reserve_ratio,
      :talent_fee,
      :contract_id,
      :deployed
    )
  end
end
