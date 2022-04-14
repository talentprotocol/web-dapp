module API
  class CreateProfilePageVisitor
    def call(ip:, user:)
      ProfilePageVisitor.find_or_create_by!(user: user, ip: ip)

      task_done = Task
        .joins(:quest)
        .where(title: "Get your profile out there")
        .where(quest: {user: user})
        .take
        .done?

      if ProfilePageVisitor.where(user: user).count > 9 && !task_done
        service = CreateInvite.new(user_id: user.id, single_use: true, talent_invite: true)
        service.call

        Quests::Update.new.call(title: "Get your profile out there", user: user)
      end
    end
  end
end
