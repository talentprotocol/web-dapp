FactoryBot.define do
  factory :admin_user, class: "User" do
    username { "Admin" }
    email { "admin@talentprotocol.com" }
    password { "password" }
    role { "admin" }
  end

  factory :user do
    sequence :username do |n|
      "user#{n}"
    end
    sequence :email do |n|
      "user_#{n}@talentprotocol.com"
    end
    password { "password" }
    email_confirmed_at { Date.today }

    trait :metamask_login do
      wallet_id { "0x123" }
      password { nil }
      email { nil }
    end

    factory :user_with_talent do
      association :talent
    end

    factory :investor_user do
      association :investor
    end
  end

  factory :message do
  end

  factory :wait_list do
    email { Faker::Internet.email }
  end

  factory :feed do
  end

  factory :notification do
    type { MessageReceivedNotification.name }
  end

  factory :talent do
  end

  factory :investor do
  end

  factory :token do
  end
end
