FactoryBot.define do
  factory :chat do
    last_message_at { Time.zone.now }
  end
end
