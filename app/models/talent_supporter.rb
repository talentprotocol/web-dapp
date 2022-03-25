class TalentSupporter < ApplicationRecord
  validates :supporter_wallet_id, :talent_contract_id, :synced_at, presence: true
  validates :supporter_wallet_id, uniqueness: {scope: :talent_contract_id}
end
