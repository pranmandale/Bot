import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/connection.js";
import cors from "cors"
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const PORT = process.env.PORT;



connectDB();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

import router from "./routes/chatBot.routes.js";
app.use("/api", router);


import AuthRouter from "./routes/auth.routes.js";
app.use("/api/auth", AuthRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
