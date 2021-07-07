class Admin::Talent::CoinsController < ApplicationController
  before_action :validate_access

  def show
    talent
    coin
  end

  def edit
    talent
    coin
  end

  def update
    if @coin.update(coin_params)
      redirect_to(
        admin_talent_path(@talent),
        notice: "Talent's coin successfully updated."
      )
    else
      render :edit
    end
  end

  private

  def talent
    @talent ||=
      if id_param
        Talent.find(params[:talent_id])
      else
        Talent.find_by!(public_key: params[:talent_id])
      end
  end

  def coin
    @coin ||= Coin.find(params[:id])
  end

  def validate_access
    if talent.coin != coin
      redirect_to root_path, alert: "This isn't the coin you're looking for."
    end
  end

  def coin_params
    params.require(:coin).permit(
      :price,
      :market_cap,
      :ticker
    )
  end
end
