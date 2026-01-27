import { model, Schema } from "mongoose";

const habitSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    completedDates: {
      type: [Date],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const habitModel = model("Habit", habitSchema);
