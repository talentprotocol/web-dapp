FactoryBot.define do
  factory :impersonation do
    impersonator { nil }
    impersonated { nil }
    ip { "MyString" }
  end
end
