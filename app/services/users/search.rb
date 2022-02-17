module Users
  class Search
    def initialize(current_user:, search_params:)
      @current_user = current_user
      @search_params = search_params
    end

    def call
      users = users_except_current_user

      users = filter_by_name(users) if filter_by_name?
      users = filter_by_messaging_disabled(users) if filter_by_messaging_disabled?

      users
    end

    private

    attr_reader :current_user, :search_params

    def users_except_current_user
      User.where.not(id: current_user.id)
    end

    def filter_by_name(users)
      users.where("username ilike ? ", "%#{search_params[:name]}%")
    end

    def filter_by_name?
      search_params.key?(:name)
    end

    def filter_by_messaging_disabled(users)
      users.where(messaging_disabled: search_params[:messaging_disabled])
    end

    def filter_by_messaging_disabled?
      search_params.key?(:messaging_disabled)
    end
  end
end