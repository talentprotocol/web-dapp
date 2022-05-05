# frozen_string_literal: true

namespace :coverage do
  task report: :environment do
    require "simplecov"

    dir = File.join(ENV["GITHUB_ARTIFACTS"])
    SimpleCov.coverage_dir(dir)

    SimpleCov.collate Dir["#{ENV["GITHUB_DOWNLOADED_ARTIFACTS"]}/simplecov-*/.resultset.json"], "rails" do
      formatter SimpleCov::Formatter::HTMLFormatter
    end
  end
end
