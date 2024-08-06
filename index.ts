import { AuthServices } from "./src/Services/AuthServices";
import { authMiddleware } from "./src/utils/AuthMiddleware";

import express from "express";
import { ApolloServer } from "apollo-server-express";
import margeTypedef from "./src/graphQL/Schema/index";
import mergeResolvers from "./src/graphQL/Resolvers/index";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(authMiddleware);

const server = new ApolloServer({
  typeDefs: margeTypedef,
  resolvers: mergeResolvers,
  context: ({ req }) => {

    try {
      
      return {
        user: (req as any).user,
        AuthServices,
      };
    } catch (error) {
      return { user: null };
    }
  },
});

// Memulai server Apollo
server.start().then(() => {
  server.applyMiddleware({ app: app as any });

  // Memulai server Express
  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
