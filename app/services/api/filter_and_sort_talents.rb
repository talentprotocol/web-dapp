class API::FilterAndSortTalents
  attr_reader :talents, :params

  def initialize(talents, params)
    @talents = talents
    @params = params
  end

  def call
    filtered_talents = filter

    sort(filtered_talents)
  end

  private

  def filter
    talents
      .joins(:user, :token)
      .filter_by_name_or_ticker(filter_params[:filter])
  end

  def sort(filtered_talents)
    if sort_params[:sort].present?
      if sort_params[:sort] == "market_cap"
        filtered_talents.joins(:token).order(market_cap: :desc)
      elsif sort_params[:sort] == "activity"
        filtered_talents.order(activity_count: :desc)
      else
        filtered_talents.order(created_at: :desc)
      end
    else
      filtered_talents.order(created_at: :desc)
    end
  end

  def filter_params
    params.permit(:filter)
  end

  def sort_params
    params.permit(:sort)
  end
end
