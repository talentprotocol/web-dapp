class CreateUser
  attr_reader :result

  def initialize
    @result = {}
  end

  def call(email:, username:, metamask_id:)
    ActiveRecord::Base.transaction do
      user = create_user(email, username, metamask_id)
      create_investor(user, username, metamask_id)
      create_feed(user)

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
    end
  end

  private

  def create_user(email, username, metamask_id)
    user = User.new
    user.email = email
    user.username = username
    user.wallet_id = metamask_id&.downcase
    user.save!
    user
  end

  def create_investor(user, username, metamask_id)
    investor = Investor.new
    investor.user = user
    investor.username = user.username
    investor.save!
    investor
  end

  def create_feed(user)
    Feed.create(user: user)
  end
end
