class User < ApplicationRecord
  include Clearance::User

  validates :role, presence: true
  validate :role_is_valid

  VALID_ROLES = ["admin"].freeze

  def admin?
    role == "admin"
  end

  private

  def role_is_valid
    unless role.in?(VALID_ROLES)
      errors.add(:base, "The role #{role} isn't supported.")
    end
  end
end
