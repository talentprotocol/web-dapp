class ImageUploader < Shrine
  plugin :determine_mime_type, analyzer: :marcel
  plugin :validation_helpers

  Attacher.validate do
    # Validate that the image file can't be bigger than 10 MB
    validate_max_size 10 * 1024 * 1024

    # Validate that the image format is an expected one
    validate_extension %w[jpg jpeg png]
    validate_mime_type %w[image/jpeg image/png]
  end
end
