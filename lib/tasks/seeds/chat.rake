if Rails.env.development?
  namespace :chat do
    task add_chats: :environment do
      puts "Setting up tags.."

      admin = User.create!(
        username: "chattest101",
        email: "chat_101@talentprotocol.com",
        password: "password",
        email_confirmed_at: Time.zone.now
      )

      investor_invite = Invites::Create.new(user_id: admin.id).call
      talent_invite = Invites::Create.new(user_id: admin.id, talent_invite: true).call

      user_2 = Users::Create.new.call(
        email: "chat_2@talentprotocol.com",
        username: "chattest2",
        password: "password",
        invite_code: investor_invite.code,
        theme_preference: "light"
      )[:user]
      user_2.confirm_email

      user_3 = Users::Create.new.call(
        email: "chat_3@talentprotocol.com",
        username: "chattest3",
        password: "password",
        invite_code: investor_invite.code,
        theme_preference: "light"
      )[:user]
      user_3.confirm_email

      user_4 = Users::Create.new.call(
        email: "chat_4@talentprotocol.com",
        username: "chattest4",
        password: "password",
        invite_code: talent_invite.code,
        theme_preference: "light"
      )[:user]
      user_4.confirm_email

      user_5 = Users::Create.new.call(
        email: "chat_5@talentprotocol.com",
        username: "chattest5",
        password: "password",
        invite_code: talent_invite.code,
        theme_preference: "light"
      )[:user]
      user_5.confirm_email

      prng = Random.new

      User.where.not(id: [user_2.id, user_3.id, user_4.id, user_5.id]).first(50).each do |user|
        prng.rand(2..15).times do |index|
          Messages::Send.new.call(sender: user_2, receiver: user, message: "Message #{index}")
        end
        prng.rand(2..15).times do |index|
          Messages::Send.new.call(sender: user_3, receiver: user, message: "Message #{index}")
        end
        prng.rand(2..15).times do |index|
          Messages::Send.new.call(sender: user_4, receiver: user, message: "Message #{index}")
        end
        prng.rand(2..15).times do |index|
          Messages::Send.new.call(sender: user_5, receiver: user, message: "Message #{index}")
        end
      end
    end
  end
end
