FactoryBot.define do
  factory :talent do
    public { true }

    trait :with_token do
      association :token
    end

    trait :with_career_goal do
      association :career_goal
    end

    trait :full_profile do
      association :token
      association :career_goal
    end
  end
end
