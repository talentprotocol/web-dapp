class Notification < ApplicationRecord
  include Noticed::Model
  belongs_to :recipient, polymorphic: true

  scope :find_by_source_id, ->(source_id) {
    where("(params->>'source_id')::bigint = ?", source_id.to_int)
  }
end
