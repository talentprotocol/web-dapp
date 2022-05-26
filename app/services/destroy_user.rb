class DestroyUser
  attr_reader :result

  def initialize(params)
    @user_id = params.fetch(:user_id)
  end

  def call
    user = User.find(@user_id)

    if user.talent? && user.talent.token.contract_id.present?
      return false
    end

    ActiveRecord::Base.transaction do
      if user.invites.count > 0
        user.invites.update_all(user_id: 1, max_uses: 0)
      end

      user.feed.feed_posts.destroy_all
      user.feed.destroy!
      user.investor.destroy!
      user.follows.destroy_all
      user.following.destroy_all

      if user.talent?
        user.talent.token.destroy!

        if user.talent.career_goal.goals.exists?
          user.talent.career_goal.goals.destroy_all
        end

        user.talent.career_goal.destroy!

        if user.talent.perks.exists?
          user.talent.perks.destroy_all
        end

        if user.talent.milestones.exists?
          user.talent.milestones.destroy_all
        end

        user.talent.destroy!
      end

      Transfer.where(user: user).update_all(user_id: nil)
      Message.where(sender_id: user.id).destroy_all
      Message.where(receiver_id: user.id).destroy_all
      Quest.where(user: user).destroy_all
      UserTag.where(user: user).destroy_all

      user.destroy!
    end
  end
end
