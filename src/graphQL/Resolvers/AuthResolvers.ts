import { AuthServices } from "../../Services/AuthServices";
import bcrypt  from 'bcrypt';
import jwt from "jsonwebtoken";



const authServices = new AuthServices(bcrypt, jwt);

export const AuthResolvers = {
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
      return await authServices.login(Email, Password);
    },
  },
};
