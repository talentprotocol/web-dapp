if Rails.env.development?
  namespace :dev do
    task prime: ["db:setup", "db:seed"] do
      puts "Setting up Users.."
      admin = User.create!(
        username: "admin",
        email: "admin@talentprotocol.com",
        password: "password",
        role: "admin",
        email_confirmed_at: Time.zone.now
      )

      admin_investor = Investor.new
      admin_investor.update!(user: admin)
      Feed.create!(user: admin)
      Tasks::PopulateForUser.new.call(user: admin)

      investor_invite = CreateInvite.new(user_id: admin.id).call
      talent_invite = CreateInvite.new(user_id: admin.id, talent_invite: true).call

      investor_result = CreateUser.new.call(
        email: "investor@talentprotocol.com",
        username: "investor",
        password: "password",
        invite_code: investor_invite.code,
        theme_preference: "light"
      )
      investor_result[:user].confirm_email

      investor_result2 = CreateUser.new.call(
        email: "investor2@talentprotocol.com",
        username: "investor2",
        password: "password",
        invite_code: investor_invite.code,
        theme_preference: "light"
      )
      investor_result2[:user].confirm_email

      investor_result3 = CreateUser.new.call(
        email: "investor3@talentprotocol.com",
        username: "investor3",
        password: "password",
        invite_code: investor_invite.code,
        theme_preference: "light"
      )
      investor_result3[:user].confirm_email

      elon_result = CreateUser.new.call(
        email: "elon@talentprotocol.com",
        username: "elon",
        password: "password",
        invite_code: talent_invite.code,
        theme_preference: "light"
      )
      elon_result[:user].confirm_email

      karl_result = CreateUser.new.call(
        email: "karl@talentprotocol.com",
        username: "karl",
        password: "password",
        invite_code: talent_invite.code,
        theme_preference: "light"
      )
      karl_result[:user].confirm_email

      bob_result = CreateUser.new.call(
        email: "bob@talentprotocol.com",
        username: "bob",
        password: "password",
        invite_code: talent_invite.code,
        theme_preference: "dark"
      )
      bob_result[:user].confirm_email

      hannah_result = CreateUser.new.call(
        email: "hannah@talentprotocol.com",
        username: "hannah",
        password: "password",
        invite_code: talent_invite.code,
        theme_preference: "dark"
      )
      hannah_result[:user].confirm_email

      olivia_result = CreateUser.new.call(
        email: "olivia@talentprotocol.com",
        username: "olivia",
        password: "password",
        invite_code: talent_invite.code,
        theme_preference: "dark"
      )
      olivia_result[:user].confirm_email

      puts "Done!"
    end
  end
end
