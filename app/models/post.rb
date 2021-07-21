class Post < ApplicationRecord
  belongs_to :user

  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :feed_posts, dependent: :destroy
  has_many :feeds, through: :feed_posts
end
