FactoryBot.define do
  factory :discovery_row do
    sequence :title do |n|
      "Title #{n}"
    end
  end
end
