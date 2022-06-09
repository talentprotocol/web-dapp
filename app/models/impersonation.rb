class Impersonation < ApplicationRecord
  encrypts :ip

  belongs_to :impersonator, class_name: "User"
  belongs_to :impersonated, class_name: "User"
end
