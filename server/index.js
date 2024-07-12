import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import "express-async-errors";

import { connectdb } from "./db/connect.js";
import upload from "./storage/files.js";
import { register } from "./contollers/auth.js";
import authRouter from "./routes/auth.js";
import tokenverify from "./middleware/auth.js";
import userRouter from "./routes/user.js";
import { createPost } from "./contollers/posts.js";
import postRoutes from "./routes/posts.js";

/* Error handling middleware */
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";

/* CONFIGURATIONS */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

/* middlewares */

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/** Routes with file */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", tokenverify, upload.single("picture"), createPost);

/* Routes */
app.use("/auth", authRouter);
app.use("/user", tokenverify, userRouter);
app.use("/posts", tokenverify, postRoutes);

/* Error handler middleware */
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 6001;

const start = async () => {
  try {
    await connectdb(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}....`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
