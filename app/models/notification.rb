class Notification < ApplicationRecord
  include Noticed::Model
  belongs_to :recipient, polymorphic: true

  scope :find_by_source_id, ->(source_id) {
    where("(params->>'source_id')::bigint = ?", source_id.to_int)
  }
  scope :find_by_source_and_model_id, ->(source_id, model_id) {
    where("(params->>'source_id')::bigint = ?", source_id.to_int)
      .where("(params->>'model_id')::bigint = ?", model_id.to_int)
  }
  scope :unemailed, -> { where(emailed_at: nil) }

  def mark_as_emailed
    update_column(:emailed_at, Time.current)
  end
end
