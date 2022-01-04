class PortfolioController < ApplicationController
  def show
    @all_talent = Talent.al
  end
end
