class AddUniquenessConstraintToTalentTags < ActiveRecord::Migration[6.1]
  def change
    add_index :talent_tags, [:talent_id, :tag_id], unique: true
  end
end
