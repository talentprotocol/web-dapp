class TalentChangedNotification < BaseNotification
  param "source_id"

  def url
    talent_path(source.username) if source.present?
  end
end
