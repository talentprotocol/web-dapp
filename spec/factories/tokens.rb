FactoryBot.define do
  factory :token do
    association :talent
    contract_id { SecureRandom.hex }
  end
end
