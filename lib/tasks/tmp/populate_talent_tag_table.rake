namespace :talent_tags do
  task populate: :environment do
    Tag.find_each do |tag|
      existing_tag = TalentTag.joins(:tag).find_by(tag: {description: tag.description.downcase})&.tag

      if existing_tag
        TalentTag.find_or_create_by(tag_id: existing_tag.id, talent_id: tag.talent_id)
      else
        TalentTag.find_or_create_by(tag_id: tag.id, talent_id: tag.talent_id)
      end
    end
  end
end
