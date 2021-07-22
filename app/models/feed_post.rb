class FeedPost < ApplicationRecord
  belongs_to :feed
  belongs_to :post
end
