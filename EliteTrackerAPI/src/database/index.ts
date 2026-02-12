import mongoose from "mongoose";

export async function setupMongo() {
  const { MONGO_URL: mongoUrl } = process.env;

  try {
    //condicional pra não criar uma conexão desnecessária
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(String(mongoUrl), {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅Connected to MongoDB!");
  } catch (err) {
    throw new Error(`❌Database error: ${err}`);
  }
}
