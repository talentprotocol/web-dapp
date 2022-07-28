module ApplicationHelper
  include Pagy::Frontend

  def flash_messages
    flash.map do |type, text|
      {type: type, heading: text}
    end
  end
end
