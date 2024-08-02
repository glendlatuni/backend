import { gql } from "apollo-server-express";

export const familyTypedef = gql`
  type Family {
    id: ID!
    FamilyName: String!
    FamilyMembers: [Members!]!
    IsLeaders: IsLeaders
  }

  input FamilyInput {
    id: ID
    FamilyName: String!
  }

  type Query {
    queryGetFamily: [Family!]!
    queryGetFamilyByID(id: ID!): Family!
    familySearch(search: String): [Family!]
    querySearchFamilyByKSP(search: String): [Family!]
  }

  type Mutation {
    getFamily(id: ID!): Family
    createFamily(data: FamilyInput!): Family
    deleteFamily(id: ID!): Family
    updateFamily(id: ID!, data: FamilyInput!): Family
  }
`;