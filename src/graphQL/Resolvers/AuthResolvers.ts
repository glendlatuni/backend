import { ApolloError, AuthenticationError } from "apollo-server-core";
import { AuthServices } from "./../../Services/AuthServices";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authServices = new AuthServices(bcrypt, jwt);

export const AuthResolvers = {
  Query: {
    getUserByID: async (_: any, args: { id: string }) => {
      try {


        const user = await authServices.getUserId(args.id);
        if (!user) {
          throw new Error("User not found");
        }
        return user;

      } catch (error) {
        console.error(error);
        throw error;
      }
      
    },
  },


  Mutation: {
    register: async (
      _: any,
      {
        Email,
        Password,
        Member_Id,
      }: { Email: string; Password: string; Member_Id: string }
    ) => {
      return await authServices.register(Email, Password, Member_Id);
    },

    login: async (
      _: any,
      { Email, Password }: { Email: string; Password: string }
    ) => {
      try {
        const result = await authServices.login(Email, Password);
        console.log("Login Success:", result);
        return result;
      } catch (error) {
        console.log(error);
        if (error.message === "Invalid email or password") {
          throw new AuthenticationError("Invalid email or password");
        }
        throw new ApolloError("An error occurred during login");
      }
    },
  },
};
