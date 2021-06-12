class User < ApplicationRecord
  include Clearance::User

  validates :role, presence: true
  validate :role_is_valid
  validate :external_id_or_email_and_password

  has_one :talent
  has_one :investor

  VALID_ROLES = ["admin", "investor", "talent"].freeze

  def admin?
    role == "admin"
  end

  private

  def role_is_valid
    unless role.in?(VALID_ROLES)
      errors.add(:base, "The role #{role} isn't supported.")
    end
  end

  def email_optional?
    true
  end

  def password_optional?
    true
  end

  def external_id_or_email_and_password
    unless external_id.present? || (email.present? && password.present?)
      errors.add(:base, "The user doesn't respect the required login requirements")
    end
  end
end
