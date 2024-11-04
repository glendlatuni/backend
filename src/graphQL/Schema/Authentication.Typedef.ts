// src/schema.ts
import { gql } from "apollo-server-express";

export const AuthenticationtypeDefs = gql`
  type User {
    id: ID!
    Email: String!
    Password: String!
    Member: Members
  }

  input newUser {
    Email: String!
    Password: String!
    Member_Id: String!
    PhoneNumber: String!
  }

  type AuthPayload {
    user: User
    token: String
    refreshToken: String
  

  }



  type RefreshTokenResponse {
    accessToken: String
  }

  type LogoutResponse {
    success: Boolean!
  }

  type Query {
    users: [User!]!
    getUserByID(id: ID!): User!
  }

  type Mutation {

    login(Email: String!, Password: String!): AuthPayload!
    registerNewUser(
      Email: String!
      Password: String!
      Member_Id: String!
      PhoneNumber: String!
    ): AuthPayload!
    refreshAccessToken(refreshToken: String!): RefreshTokenResponse!
    logout(userId: String!): Boolean
  }
`;
