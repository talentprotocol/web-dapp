class FeedsController < ApplicationController
  before_action :set_alert, only: [:show]

  def show
    @pagy, @posts = pagy(current_user.feed.posts.includes([user: [talent: :coin]]).order(id: :desc))

    @talent_leaderboard = Talent.where.not(ito_date: nil).includes([:user, :coin]).order(id: :desc).limit(10)
  end

  private

  def set_alert
    # at some point we can extract this to application controller and search
    # for request.path - but for security reasons we might not want to do so
    @alert = AlertConfiguration.find_by(page: feed_path)
  end
end
