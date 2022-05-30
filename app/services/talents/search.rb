module Talents
  class Search
    def initialize(filter_params: {}, sort_params: {}, discovery_row: nil)
      @filter_params = filter_params
      @sort_params = sort_params
      @discovery_row = discovery_row
    end

    def call
      talents = Talent.base.joins(:user, :token)

      talents = filter_by_discovery_row(talents) if discovery_row
      talents = filter_by_keyword(talents) if keyword
      talents = filter_by_status(talents)

      sort(talents)
    end

    private

    attr_reader :discovery_row, :filter_params, :sort_params

    def filter_by_discovery_row(talents)
      users = User.joins(tags: :discovery_row)

      users = users.where(
        "discovery_rows.id = ?",
        discovery_row.id
      )

      talents.where(user_id: users.distinct.pluck(:id))
    end

    def filter_by_keyword(talents)
      users = User.joins(talent: :token).left_joins(:tags)

      users = users.where(
        "users.username ilike :keyword " \
        "OR users.display_name ilike :keyword " \
        "OR tokens.ticker ilike :keyword " \
        "OR tags.description ilike :keyword ",
        keyword: "%#{keyword}%"
      )

      talents.where(user: users.distinct.select(:id))
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
      elsif filter_params[:status] == "Pending approval"
        Talent.joins(:user).where(user: {profile_type: "waiting_for_approval"})
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
