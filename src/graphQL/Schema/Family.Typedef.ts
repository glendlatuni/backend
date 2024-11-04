import { gql } from "apollo-server-express";

export const familyTypedef = gql`
  type Family {
    id: ID!
    FamilyName: String!
    FamilyMembers: [Members!]!
    IsLeaders: IsLeaders!
    Rayon: Rayon
    KSP: KSP
    Address: String
  }

  type KSP {
    id: ID!
    kspname: String!
  }

  type Rayon {
    id: ID!
    rayonNumber: Int!
  }

  type FamilyPagination {
    data: [Family!]!
    totalCount: Int!
    totalPages: Int!
  }

  input FamilyInput {
    FamilyName: String!
    rayonId: ID
    kspId: ID
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
 
    createFamily(data: FamilyInput!): Family
    updateFamily(id: ID!, data: FamilyInput!): Family
  }
`;
