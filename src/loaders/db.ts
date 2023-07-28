import mongoose from "mongoose";
import { MONGO_DB_URL } from "../config/secretKey.js";

mongoose.connection.once("open", () => {
  console.log("MongoDB has been successfully connected");
});

mongoose.connection.on("error", (error) => {
  console.error(error);
});

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_DB_URL);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
};

export { connectDB, disconnectDB };
