class DiscoveryController < ApplicationController
  def index
    @most_trendy_talents = Talent.all.limit(3)

    @latest_added_talents = base_talent
      .where.not(token: {contract_id: nil})
      .order(created_at: :desc)
      .limit(3)

    @launching_soon_talents = base_talent
      .where(token: {contract_id: nil})
      .order(created_at: :desc)
      .limit(3)

    @discovery_rows = []

    DiscoveryRow.find_each do |row|
      talents_by_tag = base_talent.joins(:tags).where(tags: {id: row.tags.pluck(:id)}).distinct.order(:id)
      @discovery_rows << {title: row.title, talents: talents_by_tag.sample(4, random: Random.new(Date.today.jd))}
    end

    @marketing_articles = MarketingArticle.all.order(created_at: :desc).limit(3)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @discovery_rows }
    end
  end

  private

  def base_talent
    @base_talent ||= Talent.where(public: true).includes([:user, :token])
  end
end
