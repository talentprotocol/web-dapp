require "eth_explorer/response"

module EthExplorer
  BASE_URL = "https://api.ethplorer.io"

  TOKEN_INFO_URL = "#{BASE_URL}/getTokenInfo"
  TOKEN_HOLDERS_URL = "#{BASE_URL}/getTopTokenHolders"

  class Client
    def token_info(token_address:)
      Response.new(
        http_response: Faraday.get(
          "#{TOKEN_INFO_URL}/#{token_address}",
          base_params
        )
      )
    end

    def token_holders(token_address:)
      Response.new(
        http_response: Faraday.get(
          "#{TOKEN_HOLDERS_URL}/#{token_address}",
          base_params.merge(limit: 1000)
        )
      )
    end

    private

    def base_params
      {
        apiKey: ENV.fetch("ETH_EXPLORER_API_KEY")
      }
    end
  end
end
