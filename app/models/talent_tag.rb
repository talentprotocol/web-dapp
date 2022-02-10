class TalentTag < ApplicationRecord
  belongs_to :talent
  belongs_to :tag

  validate :one_talent_tag_combination

  private

  def one_talent_tag_combination
    talent_tags = TalentTag.where(talent_id: talent_id, tag_id: tag_id)
    return unless talent_tags.count.positive?

    errors.add(:base, "Talent tag already exists")
  end
end
