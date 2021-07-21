class Feed < ApplicationRecord
  belongs_to :user
  has_many :feed_posts
  has_many :posts, through: :feed_posts
end
