module TheGraph
  MAX_RECORDS = 100

  TALENT_SUPPORTERS_QUERY = ::TheGraphAPI::Client.parse <<-'GRAPHQL'
    query($id: ID!, $skip: Int!, $first: Int!) {
      talentToken(id: $id) {
        supporterCounter
        totalSupply
        supporters(
          skip: $skip
          first: $first
          orderBy: id
          orderDirection: asc
        ) {
          id
          amount
          talAmount
        }
      }
    }
  GRAPHQL

  class Client
    class Error < StandardError; end

    class QueryError < Error; end

    def talent_supporters(talent_address:, offset: 0)
      query TALENT_SUPPORTERS_QUERY, id: talent_address, skip: offset, first: MAX_RECORDS
    end

    private

    def query(definition, variables = {})
      response = ::TheGraphAPI::Client.query(definition, variables: variables)

      if response.errors.any?
        raise QueryError.new(response.errors[:data].join(", "))
      else
        response
      end
    end
  end
end
