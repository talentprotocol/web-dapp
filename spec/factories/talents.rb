FactoryBot.define do
  factory :talent do
    public { true }

    trait :with_token do
      association :token
    end
  end
end
