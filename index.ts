import { errorHandler } from "./src/utils/errorHandler";
import express, { Express, Request, Response } from "express";

import familyRoutes from "./src/Routes/FamilyRoutes";
import memberRoutes from "./src/Routes/MemberRoutes";
import countRoutes from "./src/Routes/CountRoutes";
import scheduleRoutes from "./src/Routes/ScheduleRouter";

import cors from "cors";
const app: Express = express();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 4000;

app.use(cors());

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("express + typescript");
});

app.use("/family", familyRoutes);
app.use("/member", memberRoutes);
app.use("/count", countRoutes);
app.use("/schedule", scheduleRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server running at http://localhost:${port}`);
});

prisma
  .$connect()
  .then(() => console.log("Connected to database"))
  .catch((e) => console.error("Failed to connect to database", e));
