module NFT
  class GenerateMemberNFT
    def initialize(user:)
      @user = user
      @image_path = ENV["ENABLE_COMMUNITY_MEMBER_NFT"] == "enable" ? "public/Member_NFT02.jpg" : "public/Member_NFT01.jpg"
    end

    def call
      generate_image
      upload_image
    end

    private

    def generate_image
      base = Magick::ImageList.new(@image_path)

      text = Magick::Draw.new
      message = (@user.display_name || @user.username).upcase
      number_of_lines = 1

      scale = 2
      fontsize = 14 * scale
      lineheight = fontsize * 1.85

      x = 244 * 2
      y = 881 * scale + 1
      width = 1024
      height = lineheight * number_of_lines

      base.annotate(text, width, height, x, y, message) do |txt|
        txt.pointsize = fontsize # Font size
        txt.font = "public/font/PlusJakartaSans-Bold.ttf"
        txt.fill = "#E1C3FFB3" # Font color
        txt.kerning = 5.6
      end

      base.flatten_images.write "tmp/member_#{@user.username}.jpg"
    end

    def upload_image
      file = File.open("tmp/member_#{@user.username}.jpg")

      image = ImageUploader.upload(file, :store)

      image.url
    end
  end
end
