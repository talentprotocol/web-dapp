FactoryBot.define do
  factory :quest do
    trait :with_talent_profile_quest do
      type { "Quests::TalentProfile" }
      status { "pending" }
      association :task, :highlights
      association :user
    end
  end
end
