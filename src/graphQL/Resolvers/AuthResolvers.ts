import { ApolloError, AuthenticationError } from "apollo-server-core";
import { AuthServices } from "./../../Services/AuthServices";

const authServices = new AuthServices();

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
    registerNewUser: async (
      _: any,
      {
        Email,
        Password,
        Member_Id,
        PhoneNumber,
      }: {
        Email: string;
        Password: string;
        Member_Id: string;
        PhoneNumber: string;
      }
    ) => {
      const register = await authServices.register(
        Email,
        Password,
        Member_Id,
        PhoneNumber
      );
      console.log("Register Success:", register.user.Member?.FullName);
      return {
        user: {
          id: register.user.id,
          email: register.user.Email,
          memberId: register.user.Member_id,
          PhoneNumber: register.user.PhoneNumber,
        },
        token: register.token,
        refreshToken: register.refreshToken,
      };
    },

    // verifyCode: async (
    //   _: any,
    //   { userId, verificationId, verificationCode }: { userId: string; verificationId: string; verificationCode: string }
    // ) => {
    //   const result = await authServices.verifyCode(userId, verificationCode, verificationId);
    //   console.log("Verification Success:", result);
    //   return result;
    // },

    refreshAccessToken: async (
      _: any,
      { refreshToken }: { refreshToken: string }
    ) => {

      try {
        const newAccessToken = await authServices.refreshToken(
          refreshToken
        );
        console.log("Refresh Access Token Success:", newAccessToken);
        return newAccessToken;
      } catch (error) {
        console.error("Error refreshing access token:", error);
        throw new Error('Failed to refresh access token');
      }
      
    },

    login: async (
      _: any,
      { Email, Password }: { Email: string; Password: string }
    ) => {
      try {
        const result = await authServices.login(Email, Password);
        console.log("Login Success:", result.user.Member?.FullName);
        return {
          token: result.token,
          refreshToken: result.refreshToken,
          user: result.user,
        };
      } catch (error) {
        console.log(error);
        if (error.message === "Invalid email or password") {
          throw new AuthenticationError("Invalid email or password");
        }
        throw new ApolloError("An error occurred during login");
      }
    },
    logout: async (_: any, { userId }: { userId: string }) => {
      const Logout = await authServices.logout(userId);
      console.log("Logout Success:", userId);
      return Logout;
    },
  },
};
