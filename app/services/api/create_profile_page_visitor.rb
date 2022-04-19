module API
  class CreateProfilePageVisitor
    def call(ip:, user:)
      profile_page_visitor = ProfilePageVisitor.find_or_create_by!(user: user, ip: ip)
      profile_page_visitor.update(last_visited_at: Time.current)

      task_done = Task
        .joins(:quest)
        .where(type: "Tasks::ShareProfile")
        .where(quest: {user: user})
        .take
        .done?

      if ProfilePageVisitor.where(user: user).count > 9 && !task_done
        service = CreateInvite.new(user_id: user.id, single_use: true, talent_invite: true)
        service.call

        UpdateQuestJob.perform_later(type: "Tasks::ShareProfile", user_id: user.id)
      end
    end
  end
end
