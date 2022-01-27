class ImageUploader < Shrine
  plugin :validation_helpers

  Attacher.validate do
    # Validate that the image file can't be bigger than 10 MB
    validate_max_size 10 * 1024 * 1024
  end
end
