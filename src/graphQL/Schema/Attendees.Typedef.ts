import { gql } from "apollo-server-express";

export const attendeesTypedef = gql`
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


  type Query {
    queryGetAttendees: [Attendees!]!
 
  }



  type Mutation {
    createAttendees(data: createAttendees!): Attendees
    updateAttendees(id: ID!, data: updateAttendees!): Attendees

    updateRealAttendees(id: ID!, data: updateRealAttendees!): Attendees
  }

`
