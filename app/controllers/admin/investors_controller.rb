class Admin::InvestorsController < ApplicationController
  before_action :set_investor, only: [:show, :edit, :update, :destroy]

  def index
    @pagy, @investors = pagy(Investor.all)
  end

  def show
  end

  def new
    @investor = Investor.new
  end

  def create
    @investor = Investor.new(investor_params)

    if @investor.save
      redirect_to(
        admin_investor_path(@investor),
        notice: "Investor successfully created."
      )
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @investor.update(investor_params)
      redirect_to(
        admin_investor_path(@investor),
        notice: "Investor successfully updated."
      )
    else
      render :edit
    end
  end

  def destroy
    if @investor.destroy
      redirect_to(
        admin_investors_path,
        notice: "Investor successfully destroyed."
      )
    else
      render :show
    end
  end

  private

  def set_investor
    @investor =
      if params[:id].to_i > 0
        Investor.find(params[:id])
      else
        Investor.find_by!(public_key: params[:id])
      end
  end

  def investor_params
    params.require(:investor).permit(
      :username,
      :wallet_id,
      :public_key,
      :description
    )
  end
end
