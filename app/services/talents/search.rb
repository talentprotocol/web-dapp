module Talents
  class Search
    def initialize(params)
      @params = params
    end

    def call
      talents = Talent.base
      talents = filter_by_name_or_ticker(talents) if filter_params.key?(:filter)

      sort(talents)
    end

    private

    attr_reader :params

    def filter_by_name_or_ticker(talents)
      talents
        .joins(:user, :token)
        .where(
          "users.username ilike ? OR users.display_name ilike ? OR tokens.ticker ilike ?",
          "%#{filter_params[:filter]}%",
          "%#{filter_params[:filter]}%",
          "%#{filter_params[:filter]}%"
        )
    end

    def sort(talents)
      if sort_params[:sort].present?
        if sort_params[:sort] == "market_cap"
          talents.joins(:token).order(market_cap: :desc)
        elsif sort_params[:sort] == "activity"
          talents.order(activity_count: :desc)
        else
          talents.order(created_at: :desc)
        end
      else
        talents.order(created_at: :desc)
      end
    end

    def filter_params
      params.permit(:filter)
    end

    def sort_params
      params.permit(:sort)
    end
  end
end
