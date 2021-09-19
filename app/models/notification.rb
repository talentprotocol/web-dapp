class Notification < ApplicationRecord
  belongs_to :user

  validates_presence_of :body

  TYPES = %w[
    Notifications::CoinBought
    Notifications::MessageReceived
    Notifications::TalentListed
    Notifications::TalentChanged
  ].freeze

  validates :type, inclusion: { in: TYPES }
end
