require "the_graph/client"
require "json"

module Rack
  class HealthCheck
    def call(env)
      status = {
        redis: {
          connected: redis_connected
        },
        postgres: {
          connected: postgres_connected
        },
        the_graph: {
          connected: the_graph_connected
        }
      }

      [200, {}, [JSON.generate(status)]]
    end

    protected

    def redis_connected
      redis.ping == "PONG"
    rescue
      false
    end

    def redis
      Redis.new(url: ENV["REDIS_URL"])
    end

    def postgres_connected
      return true if ApplicationRecord.connected?

      ApplicationRecord.establish_connection
      ApplicationRecord.connection
      ApplicationRecord.connected?
    rescue
      false
    end

    def the_graph_connected
      !!TheGraphAPI::Client.query(TheGraph::HEALTH_CHECK_QUERY, variables: {})
    rescue
      false
    end
  end
end
