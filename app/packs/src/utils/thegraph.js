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

console.log('apollo client:', client, THE_GRAPH_ENDPOINTS);

// the limit of chars on a query string is 2048
// since each wallet id is 42 chars long
// that means we can only request 48 wallet ids
// we we include the param name ex:
// ?tokens[]= that is 10 extra chars
// ?supporters[]= that is 14 extra chars
// 2048 / (42 + 14) = ~36
export const PAGE_SIZE = 30;

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
  query GetSupporterPortfolio($id: String!, $skip: Int!, $first: Int!) {
    supporter(id: $id) {
      id
      totalAmount
      rewardsClaimed
      talents(
        skip: $skip
        first: $first
        orderBy: amount
        orderDirection: desc
      ) {
        id
        amount
        talAmount
        firstTimeBoughtAt
        lastTimeBoughtAt
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
  query GetTalentPortfolio($id: String!, $skip: Int!, $first: Int!) {
    talentToken(id: $id) {
      id
      totalValueLocked
      supporterCounter
      totalSupply
      marketCap
      rewardsReady
      rewardsClaimed
      supporters(
        skip: $skip
        first: $first
        orderBy: amount
        orderDirection: desc
      ) {
        id
        amount
        talAmount
        firstTimeBoughtAt
        lastTimeBoughtAt
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
