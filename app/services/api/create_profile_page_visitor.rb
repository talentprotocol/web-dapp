module API
  class CreateProfilePageVisitor
    def call(ip:, user:)
      profile_page_visitor = ProfilePageVisitor.find_or_create_by!(user: user, ip: ip)
      profile_page_visitor.update(last_visited_at: Time.current)

      if ProfilePageVisitor.where(user: user).count > 9
        UpdateTasksJob.perform_later(type: "Tasks::ShareProfile", user_id: user.id)
      end
    end
  end
end
