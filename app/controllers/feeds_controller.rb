class FeedsController < ApplicationController
  def show
    @pagy, @posts = pagy(current_user.feed.posts.order(id: :desc))
  end
end
