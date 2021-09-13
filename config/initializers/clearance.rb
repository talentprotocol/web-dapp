Clearance.configure do |config|
  config.routes = false
  config.mailer_sender = "no-reply@talentprotocol.com"
  config.rotate_csrf_on_sign_in = true
  config.allow_sign_up = false
  config.sign_in_guards = ["UpdateUserMetadataGuard"]
end
