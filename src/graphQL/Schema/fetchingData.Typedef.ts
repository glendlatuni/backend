import { gql } from "apollo-server-express";

export const fetchingData = gql`
  type Members {
    id: ID!
    FullName: String!
  }

  type Query {
    fetchingGetMembers: [Members]
    fetchingGetMemberByID(id: ID!): Members
  }
`;
