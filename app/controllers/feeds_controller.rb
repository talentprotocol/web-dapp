class FeedsController < ApplicationController
  def show
    @posts = current_user.feed.posts.includes([user: [talent: :token]]).order(id: :desc)

    @active_talents = Talent.active.limit(3)
    @upcoming_talents = Talent.upcoming.limit(3)
  end
end
