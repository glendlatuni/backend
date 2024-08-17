// src/schema.ts
import { gql } from "apollo-server-express";

export const AuthenticationtypeDefs = gql`
  type User {
    id: ID!
    Email: String!
    Password: String!
    Member: Members
  }

  type AuthPayload {
    user: User
    token: String
  }

  type Query {
    users: [User!]!
    getUserByID(id:ID!): User!
  }


  type Mutation {
    login(Email: String!, Password: String!): AuthPayload!

    registerNewUser(Email: String!, Password: String!, Member_Id: String!): AuthPayload!
  }
`;
