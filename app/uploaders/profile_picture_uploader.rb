require 'image_processing/mini_magick'

class ProfilePictureUploader < ImageUploader
  Attacher.derivatives do |original|
    magick = ImageProcessing::MiniMagick.source(original)
    { default:  magick.resize_to_limit!(224, 224) }
  end
end
