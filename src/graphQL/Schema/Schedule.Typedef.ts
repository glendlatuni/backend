import { gql } from "apollo-server-express";

export const scheduleTypedef = gql`

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
    Liturgos: Members
    Description: String!
    Attendees: [Attendees!]
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
    Liturgos_id: ID! # gunakan id member untuk relasi 
    Description: String!
  }

input searchFieldsCategory {
  Category: String!
}
  type Query {
    queryGetScheduleByID(id: ID!): Schedule
    queryGetSchedule: [Schedule!]!
    queryGetScheduleBySearch(search: String!, searchFields: [String]!): [Schedule!]
  }

  type Mutation {
    createSchedule(data: createScheduleInput!): Schedule
    updateSchedule(id: ID!, data: createScheduleInput!): Schedule
    deleteSchedule(id: ID!): Schedule
  }


`