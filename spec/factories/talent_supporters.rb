FactoryBot.define do
  factory :talent_supporter do
    supporter_wallet_id { SecureRandom.hex }
    talent_contract_id { SecureRandom.hex }
    synced_at { Time.now }
  end
end
