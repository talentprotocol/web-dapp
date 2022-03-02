class DiscoveryController < ApplicationController
  def index
    discovery_rows = []

    DiscoveryRow.find_each do |row|
      ids = Talent
        .base
        .active
        .joins(:tags, :user)
        .where(tags: {id: row.tags.pluck(:id)})
        .where(users: {role: "basic"})
        .distinct
        .order(:id)
        .pluck(:id)

      discovery_rows << {
        id: row.id,
        title: row.title,
        talents: Talent
          .where(id: ids)
          .select("setseed(0.#{Date.today.jd}), talent.*")
          .order("random()")
      }
    end

    @discovery_rows = DiscoveryRowBlueprint.render_as_json(
      discovery_rows,
      view: :normal,
      current_user: current_user
    )
    marketing_articles = MarketingArticle.all.order(created_at: :desc).limit(3)
    @marketing_articles = MarketingArticleBlueprint.render_as_json(marketing_articles, view: :normal)
  end
end
