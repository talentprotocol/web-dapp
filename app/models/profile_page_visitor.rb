class ProfilePageVisitor < ApplicationRecord
  encrypts :ip
  blind_index :ip

  belongs_to :user

  validates :ip, uniqueness: {scope: :user}
end
