class Talent::SearchesController < ApplicationController
  def active
    @pagy, @talents = pagy(talent_sort(Talent.active), items: 6)

    respond_to do |format|
      format.html { render "talent/index" }
      format.json { render json: @talents }
    end
  end

  def upcoming
    @pagy, @talents = pagy(talent_sort(Talent.upcoming), items: 6)

    respond_to do |format|
      format.html { render "talent/index" }
      format.json { render json: @talents }
    end
  end
end
