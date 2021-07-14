class PortfolioController < ApplicationController
  def index
    @pagy, @transactions = pagy(current_user.investor&.transactions&.order(id: :desc))

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: {} }
    end
  end

  def show
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: {} }
    end
  end
end
