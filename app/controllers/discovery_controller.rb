class DiscoveryController < ApplicationController
  def index
    @most_trendy_talents = Talent.all.limit(3)

    @latest_added_talents = base_talent
      .joins(:token)
      .where.not(token: {contract_id: nil})
      .order("token.deployed_at DESC")
      .limit(3)

    @launching_soon_talents = base_talent
      .where(token: {contract_id: nil})
      .order(created_at: :desc)
      .limit(3)

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
