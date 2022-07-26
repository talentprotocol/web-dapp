class Impersonation < ApplicationRecord
  encrypts :ip

  belongs_to :impersonator, class_name: "User"
  belongs_to :impersonated, class_name: "User"

  validate :impersonator_is_admin

  private

  def impersonator_is_admin
    impersonator.admin?
  end
end
