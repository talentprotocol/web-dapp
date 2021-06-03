class TalentsController < ApplicationController
  def index
    @talents = Talent.all
  end

  def show
    @talent =
      if params[:id].to_i > 0
        Talent.find(params[:id])
      else
        Talent.find_by!(public_key: params[:id])
      end
  end
end
