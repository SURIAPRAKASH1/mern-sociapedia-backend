import mongoose from "mongoose";

export const connectdb = (url) => {
  return mongoose.connect(url);
};

// export const connectdb = async (url) => {
//   try {
//     await mongoose.connect(url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
//       socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
//     });
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     throw error;
//   }
// };
