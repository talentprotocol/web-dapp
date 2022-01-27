require 'image_processing/mini_magick'

class TalentBannerUploader < ImageUploader
  Attacher.derivatives do |original|
    magick = ImageProcessing::MiniMagick.source(original)
    { default:  magick.resize_to_limit!(2145, 356) }
  end
end
