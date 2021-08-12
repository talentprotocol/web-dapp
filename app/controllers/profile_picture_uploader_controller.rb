class ProfilePictureUploaderController < ApplicationController
  def image
    set_rack_response ProfilePictureUploader.upload_response(:cache, request.env)
  end

  private

  def set_rack_response((status, headers, body))
    self.status = status
    self.headers.merge!(headers)
    self.response_body = body
  end
end
