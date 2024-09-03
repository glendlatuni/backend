import { gql } from "apollo-server-express";

export const leadersTypedef = gql`
  type IsLeaders {
    id: ID!
    Title: String
    Member: Members
    Members_id: ID
    Schedule: [Schedule]
    onDuty: Boolean
    Admin: Boolean
  }

  input CreateIsLeadersInput {
    Title: String!
    Members_id: ID!
  }

  input updateTitle{
    Title: String!
  }

  
input leaderOnDuty{
  onDuty: Boolean!
  Admin: Boolean!
}

input updateAdmin{
  Admin: Boolean!
}



  type Query {
    queryGetLeaders: [IsLeaders!]!
    queryGetLeadersByID(id: ID!): IsLeaders
    getLeaderBySearch(search: String): [IsLeaders!]
  
  }

  type Mutation {
    createIsLeaders(data: CreateIsLeadersInput!): IsLeaders!
    updateIsLeaders(id: ID!, data: CreateIsLeadersInput!): IsLeaders
    updateIsLeadersTitle(id: ID!, data: updateTitle!): IsLeaders
    deleteIsLeaders(id: ID!): IsLeaders
    UpdateLeaderOnDuty(id: ID!, data: leaderOnDuty!): IsLeaders
    updateAdmin(id: ID!, data: updateAdmin!): IsLeaders
  }
`;
