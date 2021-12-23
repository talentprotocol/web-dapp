class Invite < ApplicationRecord
  belongs_to :user
  has_many :invitees, class_name: "User", inverse_of: :invited

  INVITE_CODE_SIZE = 8

  def active?
    max_uses.nil? || uses < max_uses
  end

  def invites_left
    if max_uses.nil?
      uses
    else
      max_uses - uses
    end
  end

  def self.generate_code
    SecureRandom.hex(INVITE_CODE_SIZE)
  end
end
