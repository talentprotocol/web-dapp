class RenameTalentTagsToUserTags < ActiveRecord::Migration[6.1]
  def change
    rename_table :talent_tags, :user_tags
    add_reference :user_tags, :user, foreign_key: true
  end
end
