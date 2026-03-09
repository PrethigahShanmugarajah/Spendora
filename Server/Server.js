// Server / Server.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";

/* -------- INITIALIZE EXPRESS -------- */
const app = express();

/* -------- CONNECT TO DATABASE -------- */
connectDB();

/* -------- MIDDLEWARE CONFIGURATION -------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------- ROUTES -------- */
app.get("/", (req, res) => res.send("API is Working!"));
app.use("/api/user", userRouter);

/* -------- PORT -------- */
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
