import { gql } from "apollo-server-express";

export const familyTypedef = gql`
  type Family {
    id: ID!
    FamilyName: String!
    FamilyMembers: [Members!]!
    IsLeaders: IsLeaders!
    Rayon: Int!
    KSP: String!
    Address: String
  }

  type FamilyPagination {
  data: [Family!]!
  totalCount: Int!
  totalPages: Int!
}

  input FamilyInput {
    FamilyName: String!
    Rayon: Int
    KSP: String
    Address: String
  }

  type Query {
    queryGetFamily: [Family!]!
    queryGetFamilyByID(id: ID!): Family
    familySearch(search: String): [Family!]
    querySearchFamilyByKSP(search: String): [Family!]
    queryGetCurrentFamilyUser: Family
    queryGetFamilyPagination(
      rayon: Int
      page: Int
      pageSize: Int
    ): FamilyPagination
  }

  type Mutation {
    getFamily(id: ID!): Family
    createFamily(data: FamilyInput!): Family
    updateFamily(id: ID!, data: FamilyInput!): Family
  }
`;
