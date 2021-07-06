class TalentController < ApplicationController
  before_action :set_alert, only: :index

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

  private

  def set_alert
    # at some point we can extract this to application controller and search
    # for request.path - but for security reasons we might not want to do so
    @alert = AlertConfiguration.find_by(page: talent_index_path)
  end
end
