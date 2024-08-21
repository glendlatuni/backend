import { zoneAuthMiddleware } from "./src/utils/zoneAuthMiddleware";
import { authMiddleware } from "./src/utils/AuthMiddleware";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import margeTypedef from "./src/graphQL/Schema/index";
import mergeResolvers from "./src/graphQL/Resolvers/index";
import { applyMiddleware } from "graphql-middleware";

import dotenv from "dotenv";
dotenv.config();

const app = express();

const schema = makeExecutableSchema({
  typeDefs: margeTypedef,
  resolvers: mergeResolvers,
});

app.use(express.json());

app.use(authMiddleware);

const schemaWithMiddleware = applyMiddleware(schema, zoneAuthMiddleware);

const server = new ApolloServer({
  schema: schemaWithMiddleware,
  context: ({ req }) => {
    return { user: (req as any).user };
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
