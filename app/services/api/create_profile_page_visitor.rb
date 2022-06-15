module API
  class CreateProfilePageVisitor
    MAX_RETRIES = 5

    def call(ip:, user:)
      count = 0
      begin
        profile_page_visitor = ProfilePageVisitor.find_or_create_by!(user: user, ip: ip)
        profile_page_visitor.update(last_visited_at: Time.current)
      rescue ActiveRecord::RecordInvalid
        count += 1
        retry if count <= MAX_RETRIES
      end
    end
  end
end
