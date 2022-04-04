class Race < ApplicationRecord
  has_many :invites

  def self.active_race
    current_time = Time.current
    find_by("started_at >= ? AND ? < ends_at", current_time, current_time)
  end
end
