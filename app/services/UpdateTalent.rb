class UpdateTalent
  def initialize(talent)
    @talent = talent
  end

  def call(params = {})
    ActiveRecord::Base.transaction do
      update_token(params[:token])

      update_user(params[:user])

      if params[:talent]
        update_tags(params[:talent][:tags])
      end

      @talent
    rescue => e
      Rollbar.error(e, "Unable to process updating the talent, affecting talent ##{@talent.id}")

      raise e
    end
  end

  private

  def update_user(user)
    return unless user && user[:username]

    @talent.user.update!(username: user[:username].downcase.delete(" ", ""))
  end

  def update_token(token)
    return unless token

    if token[:ticker][0] == "$"
      @talent.token.update!(ticker: token[:ticker].slice(1..))
    else
      @talent.token.update!(ticker: token[:ticker])
    end
  end

  def update_tags(tags)
    return unless tags

    all_tags = tags.split(",").map(&:strip)

    @talent.tags.where.not(description: all_tags).delete_all

    all_tags.each_with_index do |description, index|
      tag = Tag.find_or_initialize_by(talent_id: @talent.id, description: description)

      tag.primary = index == 0

      tag.save!
    end
  end
end
