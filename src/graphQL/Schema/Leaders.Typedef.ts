import { gql } from "apollo-server-express";

export const leadersTypedef = gql`
  type IsLeaders {
    id: ID!
    Name: String!
    Title: String!
    Member: [Members!]!
    Members_id: ID!
    Schedule: [Schedule]
    onDuty: Boolean
  }

  input CreateIsLeadersInput {
    Name: String!
    Title: String!
    Members_id: ID!
  }

  
input leaderOnDuty{
  onDuty: Boolean!
}



  type Query {
    queryGetLeaders: [IsLeaders!]!
    queryGetLeadersByID(id: ID!): IsLeaders
    leaderSearch(search: String): [IsLeaders!]
  }

  type Mutation {
    createIsLeaders(data: CreateIsLeadersInput!): IsLeaders!
    updateIsLeaders(id: ID!, data: CreateIsLeadersInput!): IsLeaders
    deleteIsLeaders(id: ID!): IsLeaders
    leaderOnDuty(id: ID!, data: leaderOnDuty!): IsLeaders
  }
`;
