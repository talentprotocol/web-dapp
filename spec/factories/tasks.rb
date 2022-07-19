FactoryBot.define do
  factory :task do
    trait :highlights do
      type { "Tasks::Highlights" }
    end
  end
end
