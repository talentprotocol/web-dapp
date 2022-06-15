class UserProfileTypeChange < ApplicationRecord
  belongs_to :user, class_name: "User", foreign_key: "user_id"
  belongs_to :who_dunnit, class_name: "User", foreign_key: "who_dunnit_id"
end
