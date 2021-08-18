class Talent::SearchesController < ApplicationController
  def active
    @pagy, @talents = pagy(apply_filters(base_talent.active), items: 6)

    respond_to do |format|
      format.html { render "talent/index" }
      format.json { render json: @talents }
    end
  end

  def upcoming
    @pagy, @talents = pagy(apply_filters(base_talent.upcoming), items: 6)

    respond_to do |format|
      format.html { render "talent/index" }
      format.json { render json: @talents }
    end
  end

  private

  def base_talent
    Talent.where.not(ito_date: nil).includes([:user, :token, :primary_tag])
  end

  def apply_filters(talent)
    filtered_talent = talent_filter(talent)
    talent_sort(filtered_talent)
  end
end
