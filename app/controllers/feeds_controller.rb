class FeedsController < ApplicationController
  before_action :set_alert, only: [:show]

  def show
    @posts = current_user.feed.posts.includes([user: [talent: :token]]).order(id: :desc)

    @active_talents = Talent.joins(:token).where(public: true).where.not(token: {contract_id: nil}).limit(3)
    @upcoming_talents = Talent.joins(:token).where(public: true).where(token: {contract_id: nil}).limit(3)
  end

  private

  def set_alert
    # at some point we can extract this to application controller and search
    # for request.path - but for security reasons we might not want to do so
    @alert = AlertConfiguration.find_by(page: feed_path)
  end
end
