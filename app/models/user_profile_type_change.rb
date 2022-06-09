class UserProfileTypeChange < ApplicationRecord
  belongs_to :user, class_name: "User"
  belongs_to :who_dunnit, class_name: "User", optional: true
end
