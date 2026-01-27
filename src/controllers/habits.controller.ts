import type { Request, Response } from "express";
import * as zod from "zod";
import { habitModel } from "../schemas/habit.model";

export class HabitsController {
  store = async (req: Request, res: Response): Promise<Response> => {
    const habitSchema = zod.object({
      name: zod.string(),
    });

    const { name } = req.body;

    const habit = habitSchema.safeParse({ name });

    if (!habit.success) {
      return res.status(400).json({ error: "❗Habit name is a string." });
    }

    const findHabit = await habitModel
      .findOne({ name: habit.data.name })
      .collation({
        locale: "en",
        strength: 2,
      });

    if (findHabit) {
      return res.status(400).json({ error: "❗This habit already exists." });
    }

    const newHabit = await habitModel.create({
      name: habit.data.name,
      completedDates: [],
    });

    return res.status(201).json(newHabit);
  };
}
