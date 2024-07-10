import express, { Express, Request, Response } from "express";

import keluargaRoutes from "./src/Routes/KeluargaRoutes";
import jemaatRoutes from "./src/Routes/JemaatRoutes";
import countRoutes from "./src/Routes/CountRoutes";

import cors from "cors"; // Cross-Origin Resource Sharing
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




app.use("/keluarga", keluargaRoutes);
app.use('/jemaat', jemaatRoutes);
app.use("/count", countRoutes);




app.listen(port, () => {
  console.log(`[server]: Server running at http://localhost:${port}`);
});

prisma
  .$connect()
  .then(() => console.log("Connected to database"))
  .catch((e) => console.error("Failed to connect to database", e));
