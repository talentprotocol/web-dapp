class DiscoveryController < ApplicationController
  def index
    @discovery_rows = []

    DiscoveryRow.find_each do |row|
      ids = base_talent.joins(:tags).where(tags: {id: row.tags.pluck(:id)}).distinct.order(:id).pluck(:id)
      @discovery_rows << {
        title: row.title,
        talents: Talent
          .where(id: ids)
          .select("setseed(0.#{Date.today.jd}), talent.*")
          .order("random()")
          .limit(4)
      }
    end

    @marketing_articles = MarketingArticle.all.order(created_at: :desc).limit(3)
  end

  private

  def base_talent
    @base_talent ||= Talent.where(public: true).includes([:user, :token])
  end
end