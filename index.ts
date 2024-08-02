
// 
// src/index.ts
import express from "express";
import { ApolloServer } from "apollo-server-express";
import margeTypedef from "./src/graphQL/Schema/index";
import mergeResolvers from "./src/graphQL/Resolvers/index";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());

const server = new ApolloServer({
  typeDefs: margeTypedef,
  resolvers: mergeResolvers,
  
  
});

// Memulai server Apollo
server.start().then(() => {
  server.applyMiddleware({ app: app as any });

  // Memulai server Express
  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
