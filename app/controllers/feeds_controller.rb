class FeedsController < ApplicationController
  def show
    @posts = current_user.feed.posts.includes([user: [talent: :token]]).order(id: :desc)

    @active_talents = Talent.joins(:token).where(public: true).where.not(token: {contract_id: nil}).limit(3)
    @upcoming_talents = Talent.joins(:token).where(public: true).where(token: {contract_id: nil}).limit(3)
  end
end
