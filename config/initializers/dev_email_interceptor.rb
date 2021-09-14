class DevEmailInterceptor
  def self.delivering_email(message)
    message.to = [ENV['DEV_EMAIL']]
  end
end

ActionMailer::Base.register_interceptor(DevEmailInterceptor) unless Rails.env.production?
