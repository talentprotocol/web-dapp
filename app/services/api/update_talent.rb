class API::UpdateTalent
  attr_reader :talent, :success

  def initialize(talent)
    @talent = talent
    @success = false
  end

  def call(talent_params, user_params, tag_params)
    update_talent(talent_params)
    update_user(user_params)

    if tag_params[:tags]
      all_tags = tag_params[:tags]
      @talent
        .user
        .user_tags
        .joins(:tag)
        .where(tag: {hidden: false})
        .where.not(tag: {description: all_tags})
        .delete_all

      all_tags.each do |description|
        tag = Tag.find_or_create_by(description: description.downcase)
        user_tag = UserTag.find_or_initialize_by(user: @talent.user, tag: tag)

        user_tag.save! unless user_tag.persisted?
      end
    end

    @success = true
  end

  private

  def update_user(params)
    @talent.user.update!(params)
  end

  def update_talent(params)
    if @talent[:public] != params[:public]
      # Notify mailerlite that profile was set public
      @talent[:public] = params[:public] || false

      UpdateQuestJob.perform_later(type: "Tasks::PublicProfile", user_id: @talent.user.id)
      AddUsersToMailerliteJob.perform_later(@talent.user.id)
    end

    if params[:profile_picture_data]
      @talent.profile_picture = params[:profile_picture_data].as_json
      @talent.profile_picture_derivatives! if @talent.profile_picture_changed?
    end

    if params[:profile]
      if params[:profile][:headline]
        @talent[:disable_messages] = params[:disable_messages] || false
        @talent.pronouns = params[:profile][:pronouns]
        @talent.occupation = params[:profile][:occupation]
        @talent.location = params[:profile][:location]
        @talent.headline = params[:profile][:headline]
        @talent.website = params[:profile][:website]
        @talent.video = params[:profile][:video]
        @talent.wallet_address = params[:profile][:wallet_address]

        if params[:profile][:occupation]
          UpdateQuestJob.perform_later(type: "Tasks::FillInAbout", user_id: @talent.user.id)
        end
      end

      if params[:profile][:discord]
        @talent.discord = params[:profile][:discord]
      end
      if params[:profile][:linkedin]
        @talent.linkedin = params[:profile][:linkedin]
      end

      if params[:profile][:telegram]
        @talent.telegram = params[:profile][:telegram]
      end

      if params[:profile][:github]
        @talent.github = params[:profile][:github]
      end

      if params[:profile][:twitter]
        @talent.twitter = params[:profile][:twitter]
      end
    end

    if params[:banner_data]
      @talent.banner = params[:banner_data].as_json
      @talent.banner_derivatives! if @talent.banner_changed?
    end

    @talent.save!
  end
end
