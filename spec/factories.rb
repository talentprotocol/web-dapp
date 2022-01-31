FactoryBot.define do
  factory :admin_user, class: "User" do
    username { "Admin" }
    email { "admin@talentprotocol.com" }
    password { "password" }
    role { "admin" }
  end

  factory :user do
    username { "User" }
    email { "user@talentprotocol.com" }
    password { "password" }

    trait :metamask_login do
      wallet_id { "0x123" }
      password { nil }
      email { nil }
    end
  end

  factory :message do
  end

  factory :wait_list do
    email { Faker::Internet.email }
  end

  factory :transaction do
  end

  factory :feed do
  end
end
