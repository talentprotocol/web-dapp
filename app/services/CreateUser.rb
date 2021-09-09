class CreateUser
  attr_reader :result

  def initialize
    @result = {}
  end

  def call(email:, username:, metamask_id:)
    ActiveRecord::Base.transaction do
      user = create_user(email, username, metamask_id)
      create_investor(user)
      create_feed(user)
      wait_list = WaitList.find_by(email: email)

      unless wait_list.present?
        WaitList.create(email: email, approved: true, talent: true)
      end

      create_talent(user)
      create_token(user)

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
        username: username,
        metamask_id: metamask_id
      )

      raise e
    end
  end

  private

  def create_user(email, username, metamask_id)
    user = User.new
    user.email = email.downcase
    user.username = username.downcase.delete(" ", "")
    user.wallet_id = metamask_id&.downcase
    user.save!
    user
  end

  def create_talent(user)
    user.create_talent!
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
end
