import { connect } from "mongoose";
import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "../routes";

dotenv.config();

async function startDBConnection() {
  await connect(process.env.DB_CLOUD_URI || "").then(() => {
    console.log("Connected to DB");
  }).catch((err) => {
    console.log(err);
  });
}

export function startServer() {
  const app = express();
  app.use(cors());
  app.use(json());
  app.use("/", router);

  const PORT = process.env.PORT || 5001;

  app.listen(PORT, () => {
    startDBConnection();
    console.log(`Server started on port: ${PORT}`);
  });
}
