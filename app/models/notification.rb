class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :source, class_name: 'User', optional: true 

  validates_presence_of :body

  TYPES = %w[
    Notifications::TokenAcquired
    Notifications::MessageReceived
    Notifications::TalentListed
    Notifications::TalentChanged
  ].freeze

  validates :type, inclusion: { in: TYPES }
end
