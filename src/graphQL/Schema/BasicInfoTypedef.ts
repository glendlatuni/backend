
import { gql } from "apollo-server-express";

export const basicInfoTypedef = gql`
  type Church {
    id: ID!
    name: String!
    rayons: [Rayon!]!
  }

  type Rayon {
    id: ID!
    rayonNumber: Int!
    ksps: [KSP!]!
    church: Church
  }

  type KSP {
    id: ID!
    kspname: String!
    rayon: Rayon
    families: [Family]
  }

  type Family{
    FamilyName: String!
    Address: String!
  }

  input ChurchInput {
    churchName: String!
    rayons: [RayonInput!]!
  }

  input RayonInput {
    number: Int!
    ksps: [KSPInput!]!
  }

  input KSPInput {
    name: String!
  }

  type Mutation {
    createBasicData(input: ChurchInput!): Church!
  }

  type Query{
    queryGetKSPS:[KSP!]
    queryGetAllRayons:[Rayon!]
    queryGetKSPbyRayonID(id: String!): [Rayon!]

  }
`;
