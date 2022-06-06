# frozen_string_literal: true

class Supporter::UpgradeToTalent
  def call(user_id:, applying: false)
    user = User.find(user_id)

    return false if user.talent.present?

    user.create_talent!
    user.talent.create_career_goal!
    user.talent.create_token!
    update_profile_type(user, applying)

    create_invite(user)

    copy_information_to_talent(user)
    
    service = Mailerlite::SyncSubscriber.new
    service.call(user)
    
    task_service = Tasks::Update.new
    task_service.call(type: 'Tasks::ApplyTokenLaunch', user: user)

    user.talent
  end

  private

  def create_invite(user)
    supporter_invite = user.invites.find_by(talent_invite: false)
    if supporter_invite
      supporter_invite.update!(max_uses: nil)
    else
      service = CreateInvite.new(user_id: user.id)
      service.call
    end
  end

  def copy_information_to_talent(user)
    user.talent.profile = user.investor.profile
    user.talent.profile_picture_data = user.investor.profile_picture_data
    user.talent.banner_data = user.investor.banner_data
    user.talent.save!
  end

  def update_profile_type(user, applying)
    user.update(profile_type: applying ? "applying" : "talent")
  end
end
