import mongoose from "mongoose";

export async function setupMongo() {
  try {
    //condicional pra não criar uma conexão desnecessária
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect("mongodb://localhost:27017/elitetracker", {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅Connected to MongoDB!");
  } catch (err) {
    throw new Error(`❌Database error: ${err}`);
  }
}
