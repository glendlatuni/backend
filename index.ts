// src/index.ts
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './src/graphQL/schema';
import { resolvers } from './src/graphQL/resolvers';
import  familyRoutes  from './src/routes/FamilyRoutes';
import  memberRoutes  from './src/routes/MemberRoutes';
import  countRoutes  from './src/routes/CountRoutes';
import scheduleRoutes  from './src/routes//ScheduleRouter';
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middleware untuk parsing JSON
app.use(express.json());



const server = new ApolloServer({ typeDefs, resolvers });

// Memulai server Apollo
server.start().then(() => {
  server.applyMiddleware({ app: app as any  });

  app.use("/family", familyRoutes);
  app.use("/member", memberRoutes);
  app.use("/count", countRoutes);
  app.use("/schedule", scheduleRoutes);


  // Memulai server Express
  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});

