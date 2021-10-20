class Invite < ApplicationRecord
  belongs_to :user
  has_many :invitees, class_name: "User", inverse_of: :invited

  INVITE_CODE_SIZE = 8

  def active?
    max_uses.nil? || uses < max_uses
  end

  def self.generate_code
    SecureRandom.hex(INVITE_CODE_SIZE)
  end
end
