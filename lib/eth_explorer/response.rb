module EthExplorer
  class Response
    def initialize(http_response:)
      @http_response = http_response
    end

    attr_reader :http_response

    def ok?
      http_response.status >= 200 && http_response.status < 300
    end

    def success?
      ok?
    end

    def result
      return unless ok?

      JSON.parse(body)
    end

    delegate :body, to: :http_response
  end
end
