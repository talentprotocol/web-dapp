$redis = if Rails.env.production?
  Redis.new(url: ENV["REDIS_URL"], ssl_params: {verify_mode: OpenSSL::SSL::VERIFY_NONE})
else
  Redis.new
end
