class CreateUser
  def initialize
  end

  def call(email:, username:, metamask_id:)
    ActiveRecord::Base.transaction do
      user = create_user(email, username, metamask_id)
      create_investor(user, username, metamask_id)

      user
    end
  end

  private

  def create_user(email, username, metamask_id)
    user = User.new
    user.email = email
    user.username = username
    user.external_id = metamask_id
    user.save!
    user
  end

  def create_investor(user, username, metamask_id)
    investor = Investor.new
    investor.user = user
    investor.username = user.username
    investor.wallet_id = user.external_id
    investor.save!
    investor
  end
end
