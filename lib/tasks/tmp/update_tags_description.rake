namespace :tags do
  task update_description: :environment do
    Tag.find_each do |tag|
      if TalentTag.where(tag: tag).length.positive?
        tag.update(description: tag.description.downcase)
      else
        tag.destroy
      end
    end
    Tag.find_each do |tag|
      tags = Tag.where(description: tag.description)
      if tags.length > 1
        tags_to_delete = tags.drop(1).pluck(:id)
        talent_tags = TalentTag.where(tag_id: tags_to_delete)
        talent_tags.update_all(tag_id: tags.first.id)
        Tag.where(id: tags_to_delete).destroy_all
      else
        next
      end
    end
  end
end
