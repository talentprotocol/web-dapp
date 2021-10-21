# frozen_string_literal: true

# See https://github.com/shakacode/react_on_rails/blob/master/docs/basics/configuration.md
# for many more options.

module RenderingExtension
  def self.custom_context(view_context)
    {
      contractsEnv: ENV["CONTRACTS_ENV"],
      transakApiKey: ENV["TRANSAK_API_KEY"]
    }
  end
end

ReactOnRails.configure do |config|
  config.build_test_command = "RAILS_ENV=test bin/webpack"
  config.server_bundle_js_file = "application.js"
  config.same_bundle_for_client_and_server = true
  config.rendering_extension = RenderingExtension
end
