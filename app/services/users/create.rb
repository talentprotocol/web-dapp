module Users
  class Create
    attr_reader :result

    def initialize
      @result = {}
    end

    def call(email:, username:, password:, invite_code:, theme_preference:)
      ActiveRecord::Base.transaction do
        invite = Invite.find_by(code: invite_code)

        invite&.update(uses: invite.uses + 1)
        user = create_user(email, username, password, invite, theme_preference)

        create_investor(user)
        create_feed(user)
        give_reward_to_inviter(invite) if invite

        if invite&.talent_invite?
          create_talent(user)
          create_token(user)
          update_profile_type(user)
          upsert_discovery_row(invite, user) if invite.partnership.present?
        end

        create_invite(user)
        create_tasks(user)

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
      user.invited = invite if invite
      user.theme_preference = theme_preference
      user.role = "basic"

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

    def upsert_discovery_row(invite, user)
      partnership = invite.partnership

      discovery_row = partnership.discovery_row
      discovery_row ||= DiscoveryRow.create!(
        partnership: partnership,
        title: partnership.name,
        description: partnership.description
      )

      tag = Tag.find_by(description: invite.code, hidden: true)
      tag ||= Tag.create!(description: invite.code, hidden: true)

      discovery_row.tags << tag unless discovery_row.tags.include?(tag)
      user.tags << tag unless user.tags.include?(tag)
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
      service = Invites::Create.new(user_id: user.id)

      service.call
    end

    def create_tasks(user)
      Tasks::PopulateForUser.new.call(user: user)
    end

    def give_reward_to_inviter(invite)
      return unless invite.user

      if invite.user.invites.where(talent_invite: true).sum(:uses) > 4
        UpdateTasksJob.perform_later(type: "Tasks::Register", user_id: invite.user.id)
      end
    end

    def update_profile_type(user)
      Users::UpdateProfileType.new.call(user_id: user.id, new_profile_type: "talent")
    end
  end
end
