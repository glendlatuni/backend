
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
    Family: Family
    Zones: Int!
    KSP: String!
    IsLeaders: IsLeaders
    Address: String!
    PhoneNumber: String!
    User: User
    Leaders: Boolean!
    Liturgos: Boolean!
    Schedule: Schedule
    profilePhoto: String
    Attendees: [Attendees!]!
  }

  type Family {
    id: ID!
    FamilyName: String!
    FamilyMembers: [Members!]!
    IsLeaders: IsLeaders
  }

  type Schedule {
    id: ID!
    Category: String!
    Date: String!
    Day: String!
    Month: String!
    Years: String!
    Time: String!
    Address: String!
    Member: Members
    IsLeaders: IsLeaders
    Liturgos: String!
    Description: String!
    Attendees: [Attendees!]
  }

  type IsLeaders {
    id: ID!
    Name: String!
    Title: String!
    Member: [Members!]!
    Members_id: ID!
    Schedule: [Schedule]
    onDuty: Boolean
  }

  type Attendees {
    id: ID!
    Members: [Members]!
    Schedule: Schedule!
    Dates: String!
    Status: String!
    Man: Int
    Woman: Int
    Kids: Int
    Total: Int
  }

  input FamilyInput {
    id: ID
    FamilyName: String!
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
    Zones: Int!
    KSP: String!
    Address: String!
    PhoneNumber: String!
    user_id: ID # Opsional, gunakan ID untuk relasi
    Leaders: Boolean!
    Liturgos: Boolean!
    ProfilePhoto: String
  }

  input CreateIsLeadersInput {
    Name: String!
    Title: String!
    Members_id: ID!
  }

  input memberUploadPhoto{
    profilePhoto: String
  }

  input createScheduleInput {
    Category: String!
    Date: String!
    Day: String!
    Month: String!
    Years: String!
    Time: String!
    Address: String!
    Member_id: ID!
    Leaders_id: ID!
    Liturgos: String!
    Description: String!
  }

  input createAttendees{
    Schedule_id: ID!
    Members_ID: [ID!]!
    Dates: String!
    Status: String!
  }

input updateAttendees{
  Members_ID: [ID!]! 
}

input updateRealAttendees{
  Man: Int!
  Woman: Int!
  Kids: Int!
  Total: Int!
}

input leaderOnDuty{
  onDuty: Boolean!
}




  type Query {
    # user section
    users: [User!]!
    # family section
    queryGetFamily: [Family!]!
    queryGetFamilyByID(id: ID!): Family!
    familySearch(search: String): [Family!]
    querySearchFamilyByKSP(search: String): [Family!]
    # Sch Section
    queryGetScheduleByID(id: ID!): Schedule
    queryGetSchedule: [Schedule!]!
    # member section
    queryGetMember: [Members!]!
    memberSearch(search: String): [Members!]!
    queryGetKSP(search: String): [Members!]
    getMemberByID(id: ID!): Members

    # att section
    queryGetAttendees: [Attendees!]!

    # leader section
    queryGetLeaders: [IsLeaders!]!
    queryGetLeadersByID(id: ID!): IsLeaders
    leaderSearch(search: String): [IsLeaders!]
  }

  type Mutation {
    # User section
    getUser(id: ID!): Members
    createUser(email: String!, password: String!): User!
    updateUser(id: ID!, email: String, password: String): User!
    deleteUser(id: ID!): User!

    # Member Section
    createMember(data: CreateMemberInput!): Members
    updateMember(id: ID!, data: CreateMemberInput!): Members
    deleteMember(id: ID!): Members
    updateMemberPhoto(id: ID!, data: memberUploadPhoto!): Members


    # Schedule Section
    createSchedule(data: createScheduleInput!): Schedule
    updateSchedule(id: ID!, data: createScheduleInput!): Schedule
    deleteSchedule(id: ID!): Schedule

    # Leader Section
    createIsLeaders(data: CreateIsLeadersInput!): IsLeaders!
    updateIsLeaders(id: ID!, data: CreateIsLeadersInput!): IsLeaders
    deleteIsLeaders(id: ID!): IsLeaders

    leaderOnDuty(id: ID!, data: leaderOnDuty!): IsLeaders


    # Family section
    getFamily(id: ID!): Family
    createFamily(data: FamilyInput!): Family
    deleteFamily(id: ID!): Family
    updateFamily(id: ID!, data: FamilyInput!): Family

    # Attendees Section
    createAttendees(data: createAttendees!): Attendees
    updateAttendees(id: ID!, data: updateAttendees!): Attendees

    updateRealAttendees(id: ID!, data: updateRealAttendees!): Attendees
  }
`;
