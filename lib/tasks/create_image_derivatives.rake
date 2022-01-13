task create_image_derivatives: :environment do
  Talent.order(:id).find_each do |talent|
    Rails.logger.info("Processing Talent #{talent.id}")

    %w(banner profile_picture).each do |attribute|
      attacher = talent.send("#{attribute}_attacher")
      next unless attacher.stored?
      attacher.create_derivatives

      begin
        attacher.atomic_persist
      rescue Shrine::AttachmentChanged,    # attachment has changed
             ActiveRecord::RecordNotFound  # record has been deleted
        attacher.delete_derivatives        # delete now orphaned derivatives
      end
    end
  end
end
