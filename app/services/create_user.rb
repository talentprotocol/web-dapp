class CreateUser
  attr_reader :result

  def initialize
    @result = {}
  end

  def call(email:, username:, password:, invite_code:, theme_preference:)
    ActiveRecord::Base.transaction do
      invite = Invite.find_by(code: invite_code)

      if invite.nil? || !invite.active?
        @result[:success] = false
        @result[:field] = "invite"
        @result[:error] = "no valid invite provided"
        return @result
      end

      invite.update(uses: invite.uses + 1)
      user = create_user(email, username, password, invite, theme_preference)

      create_investor(user)
      create_feed(user)

      if invite.talent_invite?
        create_talent(user)
        create_token(user)
      end

      create_invite(user)

      @result[:user] = user
      @result[:success] = true
      @result
    rescue ActiveRecord::RecordNotUnique => error
      @result[:success] = false
      if error.message.include?("username")
        @result[:field] = "username"
        @result[:error] = "Username is already taken."
      elsif error.message.include?("email")
        @result[:field] = "email"
        @result[:error] = "Email is already taken."
      elsif error.message.include?("wallet_id")
        @result[:field] = "wallet_id"
        @result[:error] = "We already have that wallet in the system."
      end
      @result
    rescue => e
      Rollbar.error(
        e,
        "Unable to create user with unexpected error.",
        email: email,
        username: username
      )

      raise e
    end
  end

  private

  def create_user(email, username, password, invite, theme_preference)
    user = User.new
    user.email = email.downcase
    user.password = password
    user.username = username.downcase.delete(" ", "")
    user.email_confirmation_token = Clearance::Token.new
    user.invited = invite
    user.theme_preference = theme_preference
    user.role = "basic"
    if !invite.talent_invite?
      user.race = Race.active_race
    end
    user.save!
    user
  end

  def create_talent(user)
    user.create_talent!
    user.talent.create_career_goal!
  end

  def create_token(user)
    user.talent.create_token!
  end

  def create_investor(user)
    investor = Investor.new
    investor.user = user
    investor.save!
    investor
  end

  def create_feed(user)
    feed = Feed.create!(user: user)

    admin = User.find_by(email: "admin@talentprotocol.com")
    if admin.present?
      admin.posts.find_each do |post|
        feed.posts << post
      end
    end
    feed
  end

  def create_invite(user)
    service = CreateInvite.new(user_id: user.id)

    service.call
  end
end
