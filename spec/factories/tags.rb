FactoryBot.define do
  factory :tag do
    sequence :description do |n|
      "description_#{n}"
    end
  end
end
