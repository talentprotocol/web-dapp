FactoryBot.define do
  factory :partnership do
    sequence :name do |n|
      "Name #{n}"
    end
  end
end
