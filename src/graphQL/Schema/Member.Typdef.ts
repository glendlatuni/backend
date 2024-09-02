import { gql } from "apollo-server-express";

export const memberTypedef = gql`
  type Members {
    id: ID!
    FullName: String!
    Gender: String!
    BirthPlace: String!
    BirthDate: String
    FamilyPosition: String!
    Category: String!
    Family: Family
    IsLeaders: IsLeaders
    PhoneNumber: String!
    User: User
    Leaders: Boolean!
    Liturgos: Boolean!
    Schedule: Schedule
    profilePhoto: String
    Attendees: [Attendees!]!
    Role: String
  }

  input CreateMemberInput {
    id: ID
    FullName: String!
    Gender: String!
    BirthPlace: String!
    BirthDate: String
    FamilyPosition: String!
    Category: String!
    Family_id: ID! # Gunakan ID untuk relasi
    PhoneNumber: String!
    user_id: ID # Opsional, gunakan ID untuk relasi
    Leaders: Boolean!
    Liturgos: Boolean!
    ProfilePhoto: String
  }

  input memberUploadPhoto {
    profilePhoto: String
  }

  input updateAdminRole {
    Role: String!
  }

  type Query {
    queryGetMember: [Members]
    memberSearch(search: String): [Members!]!
    queryGetKSP(search: String): [Members!]
    getMemberByID(id: ID!): Members
    queryGetMemberCanBeLiturgos: [Members]
  }

  type Mutation {
    createMember(data: CreateMemberInput!): Members
    updateMember(id: ID!, data: CreateMemberInput!): Members
    deleteMember(id: ID!): Members
    updateMemberPhoto(id: ID!, data: memberUploadPhoto!): Members
    updateAdminMemberRole(id: ID!, data: updateAdminRole!): Members
  }
`;
