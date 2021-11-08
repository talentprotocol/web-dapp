class API::UpdateTalent
  attr_reader :talent, :success

  def initialize(talent)
    @talent = talent
    @success = false
  end

  def call(params)
    update_talent(params)

    if params[:username]
      @talent.user.update(username: params[:username], display_name: params[:display_name])
    end

    if params[:primary_tag]
      if @talent.primary_tag.present?
        @talent.primary_tag.description = params[:primary_tag]
        @talent.primary_tag.save
      else
        Tag.create!(primary: true, description: params[:primary_tag], talent: @talent)
      end
    end

    if params[:secondary_tags]
      all_tags = params[:secondary_tags].split(",").map(&:strip)

      @talent.tags.where(primary: false).where.not(description: all_tags).delete_all

      all_tags.each do |description|
        tag = Tag.find_or_initialize_by(talent_id: @talent.id, description: description, primary: false)

        tag.save! unless tag.persisted?
      end
    end

    @success = true
  end

  private

  def update_talent(params)
    if params[:profile][:headline]
      @talent[:public] = params[:public] || false
      @talent[:disable_messages] = params[:disable_messages] || false
      @talent.pronouns = params[:profile][:pronouns]
      @talent.occupation = params[:profile][:occupation]
      @talent.location = params[:profile][:location]
      @talent.headline = params[:profile][:headline]
      @talent.website = params[:profile][:website]
      @talent.video = params[:profile][:video]
      @talent.wallet_address = params[:profile][:wallet_address]
    end

    if params[:profile_picture]
      @talent.profile_picture = params[:profile_picture].as_json
    end

    if params[:banner]
      @talent.banner = params[:banner].as_json
    end

    if params[:profile][:discord]
      @talent.linkedin = params[:profile][:linkedin]
      @talent.twitter = params[:profile][:twitter]
      @talent.telegram = params[:profile][:telegram]
      @talent.discord = params[:profile][:discord]
      @talent.github = params[:profile][:github]
      @talent.twitter = params[:profile][:twitter]
      @talent.twitter = params[:profile][:twitter]
    end

    @talent.save!
  end
end
