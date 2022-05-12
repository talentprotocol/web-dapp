class DiscoveryController < ApplicationController
  def index
    discovery_rows = []

    DiscoveryRow.find_each do |row|
      ids = Talent
        .base
        .active
        .joins(user: :tags)
        .where(users: {role: "basic"}, tags: {id: row.tags.pluck(:id)})
        .distinct
        .order(:id)
        .pluck(:id)

      discovery_rows << {
        id: row.id,
        slug: row.slug,
        title: row.title,
        badge: row.badge,
        badge_link: row.badge_link,
        talents: Talent
          .includes(:user, :token)
          .where(id: ids)
          .select("setseed(0.#{Date.today.jd}), talent.*")
          .order("random()")
      }
    end

    @discovery_rows = DiscoveryRowBlueprint.render_as_json(
      discovery_rows,
      view: :normal,
      current_user_watchlist: current_user_watchlist
    )

    marketing_articles = MarketingArticle.all.order(created_at: :desc).limit(3)
    @marketing_articles = MarketingArticleBlueprint.render_as_json(marketing_articles, view: :normal)
  end

  def show
    discovery_row = DiscoveryRow.find_by!(slug: params[:slug])

    service = Talents::Search.new(filter_params: filter_params.to_h, discovery_row: discovery_row)
    talents = service.call

    @discovery_row = DiscoveryRowBlueprint.render_as_json(discovery_row)
    @talents = TalentBlueprint.render_as_json(talents.includes(:user, :token), view: :normal, current_user_watchlist: current_user_watchlist)

    respond_to do |format|
      format.html
      format.json {
        render(
          json: @talents,
          status: :ok
        )
      }
    end
  end

  private

  def filter_params
    params.permit(:keyword, :status)
  end
end
