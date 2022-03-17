import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

import { THE_GRAPH_ENDPOINTS } from "./constants";

const client = (env) => {
  const uri = THE_GRAPH_ENDPOINTS[env || "staging"];

  return new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  });
};

const GET_TALENT_PORTFOLIO = gql`
  query GetTalentList($ids: [String!]) {
    talentTokens(first: 500, where: { id_in: $ids }) {
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
      rewardsClaimed
      talents(first: 300) {
        id
        amount
        talAmount
        talent {
          id
          symbol
          name
          totalSupply
          maxSupply
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
      rewardsReady
      rewardsClaimed
      supporters(first: 300) {
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

const GET_DISCOVERY_TALENTS = gql`
  query GetDiscoveryTalents($talentIds: [String!]) {
    talents: talentTokens(first: 500, where: { id_in: $talentIds }) {
      ...fields
    }
  }

  fragment fields on TalentToken {
    id
    supporterCounter
    totalSupply
  }
`;

export {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO,
  GET_TALENT_PORTFOLIO_FOR_ID,
  GET_SUPPORTER_PORTFOLIO,
  GET_TALENT_PORTFOLIO_FOR_ID_SIMPLE,
  GET_DISCOVERY_TALENTS,
  client,
};
