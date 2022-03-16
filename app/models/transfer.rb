class Transfer < ApplicationRecord
  # we want to allow for nil user_ids so we can't
  # have belongs_to without optional option
  belongs_to :user, optional: true
end
