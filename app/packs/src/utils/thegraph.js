import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/10292/talent-protocol/v0.0.16",
  cache: new InMemoryCache(),
});

const GET_TALENT_PORTFOLIO = gql`
  query GetTalentList {
    talentTokens {
      id
      supporterCounter
      totalSupply
      maxSupply
      marketCap
      name
    }
  }
`;

const GET_SUPPORTER_PORTFOLIO = gql`
  query GetSupporterPortfolio($id: String!) {
    supporter(id: $id) {
      id
      totalAmount
      talents {
        id
        amount
        talAmount
        talent {
          id
          symbol
          name
          totalSupply
          supporterCounter
          owner
        }
      }
    }
  }
`;

const GET_TALENT_PORTFOLIO_FOR_ID_SIMPLE = gql`
  query GetTalentPortfolio($id: String!) {
    talentToken(id: $id) {
      id
      totalValueLocked
      supporterCounter
      totalSupply
      marketCap
    }
  }
`;

const GET_TALENT_PORTFOLIO_FOR_ID = gql`
  query GetTalentPortfolio($id: String!) {
    talentToken(id: $id) {
      id
      totalValueLocked
      supporterCounter
      totalSupply
      marketCap
      supporters {
        id
        amount
        talAmount
        supporter {
          id
        }
      }
    }
  }
`;

export {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO,
  GET_TALENT_PORTFOLIO_FOR_ID,
  GET_SUPPORTER_PORTFOLIO,
  GET_TALENT_PORTFOLIO_FOR_ID_SIMPLE,
  client,
};
