if ENV["GITHUB_ARTIFACTS"]
  require "simplecov"
  SimpleCov.add_filter "db/migrate"
  SimpleCov.command_name "#{SimpleCov::CommandGuesser.guess} #{(ENV["CI_NODE_INDEX"].to_i + 1) || "1"}"

  SimpleCov.formatter SimpleCov::Formatter::SimpleFormatter

  dir = File.join(ENV["GITHUB_ARTIFACTS"], "simplecov-#{ENV["PROJECT_UNDER_TEST"]}-#{ENV["CI_NODE_INDEX"] || "0"}")
  SimpleCov.coverage_dir(dir)

  SimpleCov.start "rails"
end

# This file is copied to spec/ when you run 'rails generate rspec:install'
require "spec_helper"

ENV["RAILS_ENV"] ||= "test"

require File.expand_path("../config/environment", __dir__)

# Prevent database truncation if the environment is production
abort("The Rails environment is running in production mode!") if Rails.env.production?

require "rspec/rails"
require "clearance/rspec"
require "capybara/rspec"

Dir[Rails.root.join("spec", "support", "**", "*.rb")].sort.each { |f| require f }

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  puts e.to_s.strip
  exit 1
end

JS_DRIVER = :selenium_chrome_headless
Capybara.default_driver = :rack_test
Capybara.javascript_driver = JS_DRIVER
Capybara.default_max_wait_time = 2

RSpec.configure do |config|
  config.fixture_path = "#{::Rails.root}/spec/fixtures"
  config.use_transactional_fixtures = true

  config.include JsonHelper, type: :request

  config.infer_spec_type_from_file_location!

  # Filter lines from Rails gems in backtraces.
  config.filter_rails_from_backtrace!

  ActiveJob::Base.queue_adapter = :test

  config.before(:each) do |example|
    Capybara.current_driver = JS_DRIVER if example.metadata[:js]
    Capybara.current_driver = :selenium if example.metadata[:selenium]
    Capybara.current_driver = :selenium_chrome if example.metadata[:selenium_chrome]
    if Bullet.enable?
      Bullet.start_request
    end
  end

  config.after(:each) do
    Capybara.use_default_driver
    if Bullet.enable?
      Bullet.perform_out_of_channel_notifications if Bullet.notification?
      Bullet.end_request
    end
  end
end
