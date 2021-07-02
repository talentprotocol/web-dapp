class TalentController < ApplicationController
  def index
    @pagy, @talents = pagy(talent_sort(Talent.all))

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @talents }
    end
  end

  def show
    @talent =
      if params[:id].to_i > 0
        Talent.find(params[:id])
      else
        Talent.find_by!(public_key: params[:id])
      end

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @talent }
    end
  end
end
