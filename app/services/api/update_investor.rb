module API
  class UpdateInvestor
    def initialize(investor:)
      @investor = investor
    end

    def call(investor_params:, tag_params:)
      update_investor(params: investor_params)
      update_user_tags(params: tag_params)
    end

    private

    attr_reader :investor

    def update_investor(params:)
      if params[:profile_picture_data].present?
        investor.profile_picture = params[:profile_picture_data].as_json
        investor.profile_picture_derivatives! if investor.profile_picture_changed?
      end

      if params[:banner_data].present?
        investor.banner = params[:banner_data].as_json
        investor.banner_derivatives! if investor.banner_changed?
      end

      if params[:profile]
        if params[:profile][:headline]
          investor.occupation = params[:profile][:occupation]
          investor.location = params[:profile][:location]
          investor.headline = params[:profile][:headline]
          investor.website = params[:profile][:website]

          if params[:profile][:occupation]
            UpdateQuestJob.perform_later(title: "Fill in About", user_id: investor.user.id)
          end
        end

        if params[:profile][:discord]
          investor.discord = params[:profile][:discord]
        end
        if params[:profile][:linkedin]
          investor.linkedin = params[:profile][:linkedin]
        end

        if params[:profile][:telegram]
          investor.telegram = params[:profile][:telegram]
        end

        if params[:profile][:github]
          investor.github = params[:profile][:github]
        end

        if params[:profile][:twitter]
          investor.twitter = params[:profile][:twitter]
        end
      end

      investor.save!
    end

    def update_user_tags(params:)
      if params[:tags].present?
        all_tags = params[:tags]
        investor
          .user
          .user_tags
          .joins(:tag)
          .where(tag: {hidden: false})
          .where.not(tag: {description: all_tags})
          .delete_all

        all_tags.each do |description|
          tag = Tag.find_or_create_by(description: description.downcase)
          user_tag = UserTag.find_or_initialize_by(user: investor.user, tag: tag)

          user_tag.save! unless user_tag.persisted?
        end
      end
    end
  end
end
