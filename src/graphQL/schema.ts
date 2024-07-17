// src/schema.ts
import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    password: String!
    Member: Members
  }

  type Members {
    id: ID!
    FullName: String!
    Gender: String!
    BirthPlace: String!
    BirthDate: String
    FamilyPosition: String!
    Category: String!
    Family: Family!
    Zones: Int!
    KSP: String!
    Address: String!
    PhoneNumber: String!
    User: User
    IsLeaders: Boolean!
    IsLiturgos: Boolean!
    Schedule: Schedule
    profilePhoto: String
    Attendees: [Attendees!]!
  }

  input CreateMemberInput {
    FullName: String!
    Gender: String!
    BirthPlace: String!
    BirthDate: String
    FamilyPosition: String!
    Category: String!
    Family_id: ID! # Gunakan ID untuk relasi
    Zones: Int!
    KSP: String!
    Address: String!
    PhoneNumber: String!
    user_id: ID # Opsional, gunakan ID untuk relasi
    IsLeaders: Boolean!
    IsLiturgos: Boolean!
    profilePhoto: String
  }

  type Family {
    id: ID!
    FamilyName: String!
    FamilyMembers: [Members!]!
  }

  input FamilyInput {
    id: ID
    FamilyName: String!
  }

  type Schedule {
    id: ID!
    DateOfWorship: String!
    TimeOfWorship: String!
    Place: String!
    Members: Members
    Leaders: String!
    Liturgos: String!
    Description: String!
    Attendees: Int!
    Attending: [Attendees!]!
  }

  type Attendees {
    id: ID!
    user: Members!
    Schedule: Schedule!
    Dates: String!
    status: String!
  }

  type Query {
    users: [User!]!
    member: [Members!]!
    memberSearch(search: String): [Members!]!
    family: [Family!]!
    schedules: [Schedule!]!
    attendees: [Attendees!]!
  }

  type Mutation {
    # User section
    getUser(id: ID!): Members
    createUser(email: String!, password: String!): User!
    updateUser(id: ID!, email: String, password: String): User!
    deleteUser(id: ID!): User!

    # Member Section
    createMember(data: CreateMemberInput!): Members!

    # Schedule Section

    
    # Family section
    getFamily(id: ID!): Family
    createFamily(data: FamilyInput!): Family
    deleteFamily(id: ID!): Family
    updateFamily(id: ID!, data: FamilyInput!): Family
  }
`;
