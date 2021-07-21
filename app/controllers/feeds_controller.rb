class FeedsController < ApplicationController
  def show
    @feed = current_user.feed
  end
end
