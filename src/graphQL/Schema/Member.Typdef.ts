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
    MariageStatus: String!
    Family: Family
    IsLeaders: IsLeaders
    User: User
    Leaders: Boolean!
    Liturgos: Boolean!
    Schedule: Jadwal
    profilePhoto: String
    Attendees: [Attendees!]!
    Role: String
  }

  type Jadwal{
    id: ID
    Category: String
    Date: String
    Day: String
    Month: String
    Years: String
    Time: String
    Address: String
  }

  input CreateMemberInput {
    id: ID
    FullName: String!
    Gender: String!
    BirthPlace: String!
    BirthDate: String!
    MariageStatus: String!
    FamilyPosition: String!
    Category: String!
    Family_id: ID! # Gunakan ID untuk relasi
    user_id: ID # Opsional, gunakan ID untuk relasi
    Leaders: Boolean!
    Liturgos: Boolean!
    ProfilePhoto: String
  }

  input updateMemberInput {
    FullName: String
    Gender: String
    BirthDate: String
    BirthPlace: String
    FamilyPosition: String
    Category: String
    Family_id: ID
    Leaders: Boolean
    Liturgos: Boolean

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
    updateMember(id: ID!, data: updateMemberInput!): Members
    deleteMember(id: ID!): Members
    updateMemberPhoto(id: ID!, data: memberUploadPhoto!): Members
    updateAdminMemberRole(id: ID!, data: updateAdminRole!): Members
  }
`;
