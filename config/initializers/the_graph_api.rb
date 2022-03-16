require "graphql/client"
require "graphql/client/http"

# The Graph API wrapper
module TheGraphAPI
  HTTP = GraphQL::Client::HTTP.new(ENV.fetch("THE_GRAPH_URL")) do
    def headers(context)
      {"User-Agent": "Talent Protocol"}
    end
  end

  Schema = GraphQL::Client.load_schema(HTTP)

  Client = GraphQL::Client.new(schema: Schema, execute: HTTP)
end
