source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "2.7.3"

gem "rails", "~> 6.1.3", ">= 6.1.3.2"
gem "pg", "~> 1.1"
gem "puma", "~> 5.0"

# Frontend Dependencies
gem "sass-rails", ">= 6"
gem "webpacker", github: "rails/webpacker", branch: "master"
gem "jbuilder", "~> 2.7"
gem "react_on_rails", "= 12.2.0"

# Auth
gem "clearance"

# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
gem "bcrypt"

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

gem "bootsnap", ">= 1.4.4", require: false

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

group :development, :test do
  gem "awesome_print"
  gem "bundler-audit"
  gem "byebug", platforms: %i[mri mingw x64_mingw]
  gem "dotenv-rails"
  gem "pry-byebug"
  gem "pry-rails"
  gem "standard"
end

group :development do
  gem "web-console", ">= 4.1.0"
  gem "rack-mini-profiler", "~> 2.0"
  gem "listen", "~> 3.3"
  gem "spring"
  gem "foreman"
end

group :test do
  gem "capybara", ">= 3.26"
  gem "selenium-webdriver"
  gem "webdrivers"
end
gem 'mini_racer', platforms: :ruby
