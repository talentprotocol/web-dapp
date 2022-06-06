FactoryBot.define do
  factory :invite do
    code { SecureRandom.hex(8) }
    max_uses { 5 }
  end
end
