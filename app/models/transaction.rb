class Transaction < ApplicationRecord
  belongs_to :investor
  belongs_to :coin
end
