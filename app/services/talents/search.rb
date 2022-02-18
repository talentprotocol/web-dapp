module Talents
  class Search
    def initialize(filter_params: {}, sort_params: {})
      @filter_params = filter_params
      @sort_params = sort_params
    end

    def call
      talents = Talent.base.order("tokens.deployed_at DESC")
      talents = filter_by_name_or_ticker(talents) if filter_params.key?(:name)
      talents = filter_by_status(talents) if filter_params.key?(:status)

      sort(talents)
    end

    private

    attr_reader :filter_params, :sort_params

    def filter_by_name_or_ticker(talents)
      talents
        .joins(:user, :token)
        .where(
          "users.username ilike ? OR users.display_name ilike ? OR tokens.ticker ilike ?",
          "%#{filter_params[:name]}%",
          "%#{filter_params[:name]}%",
          "%#{filter_params[:name]}%"
        )
    end

    def filter_by_status(talents)
      if filter_params[:status] == "Launching soon"
        talents.upcoming.order(created_at: :desc)
      elsif filter_params[:status] == "Latest added" || filter_params[:status] == "Trending"
        talents
          .active
          .where("tokens.deployed_at > ?", 1.month.ago)
          .order("tokens.deployed_at DESC")
      else
        talents
      end
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
  end
end
