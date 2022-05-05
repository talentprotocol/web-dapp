require "graphql/client"
require "graphql/client/http"

# The Graph API wrapper
module TheGraphAPI
  the_graph_url = ENV.fetch("THE_GRAPH_URL")

  if the_graph_url.starts_with?("http")
    HTTP = GraphQL::Client::HTTP.new(the_graph_url) do
      def headers(context)
        {"User-Agent": "Talent Protocol"}
      end
    end

    Schema = GraphQL::Client.load_schema(HTTP)

    Client = GraphQL::Client.new(schema: Schema, execute: HTTP)
  end
end
