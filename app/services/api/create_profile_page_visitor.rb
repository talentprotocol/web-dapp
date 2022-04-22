module API
  class CreateProfilePageVisitor
    def call(ip:, user:)
      profile_page_visitor = ProfilePageVisitor.find_or_create_by!(user: user, ip: ip)
      profile_page_visitor.update(last_visited_at: Time.current)

      if ProfilePageVisitor.where(user: user).count >= (ENV["VISITORS_COUNT"].to_i || 10)
        UpdateTasksJob.perform_later(type: "Tasks::ShareProfile", user_id: user.id)
      end
    end
  end
end
