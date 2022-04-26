module Talents
  class Search
    def initialize(filter_params: {}, sort_params: {})
      @filter_params = filter_params
      @sort_params = sort_params
    end

    def call
      talents = Talent.base.joins(:user, :token).left_joins(user: :tags)

      talents = filter_by_keyword(talents) if keyword
      talents = filter_by_status(talents)

      sort(talents)
    end

    private

    attr_reader :filter_params, :sort_params

    def filter_by_keyword(talents)
      talents
        .where(
          "users.username ilike :keyword " \
          "OR users.display_name ilike :keyword " \
          "OR tokens.ticker ilike :keyword " \
          "OR tags.description ilike :keyword",
          keyword: "%#{keyword}%"
        )
    end

    def keyword
      @keyword ||= filter_params[:keyword]
    end

    def filter_by_status(talents)
      if filter_params[:status] == "Launching soon"
        talents.upcoming.order(created_at: :asc)
      elsif filter_params[:status] == "Latest added" || filter_params[:status] == "Trending"
        talents
          .active
          .where("tokens.deployed_at > ?", 1.month.ago)
          .order("tokens.deployed_at ASC")
      else
        talents
          .select("setseed(0.#{Date.today.jd}), talent.*")
          .order("random()")
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
