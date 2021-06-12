Clearance.configure do |config|
  config.routes = false
  config.mailer_sender = "reply@example.com"
  config.rotate_csrf_on_sign_in = true
  config.allow_sign_up = false
  config.sign_in_guards = ["UpdateUserMetadataGuard"]
end
