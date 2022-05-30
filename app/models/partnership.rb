class Partnership < ApplicationRecord
  belongs_to :invite, optional: true
  has_one :discovery_row

  validates :name, presence: true, uniqueness: true
end
