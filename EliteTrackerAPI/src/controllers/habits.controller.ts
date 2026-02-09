import dayjs from "dayjs";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import * as zod from "zod";
import { habitModel } from "../schemas/habit.model";
import buildValidationErrorMessage from "../utils/buildValidationErrorMessage.util";

export class HabitsController {
  store = async (req: Request, res: Response): Promise<Response> => {
    const habitSchema = zod.object({
      name: zod.string(),
    });

    const habit = habitSchema.safeParse(req.body);

    if (!habit.success) {
      const errors = buildValidationErrorMessage(habit.error.issues);

      return res.status(422).json({ messageError: errors });
    }

    const findHabit = await habitModel
      .findOne({ name: habit.data.name, userId: req.user.id })
      .collation({
        locale: "en",
        strength: 2,
      });

    if (findHabit) {
      return res.status(400).json({ error: "❗This habit already exists." });
    }

    const newHabit = await habitModel.create({
      name: habit.data.name,
      userId: req.user.id,
      completedDates: [],
    });

    return res.status(201).json(newHabit);
  };

  index = async (_req: Request, res: Response) => {
    const habits = await habitModel
      .find({ userId: _req.user.id })
      .sort({ name: 1 });

    if (!habits) {
      return res.status(404).json({ error: "❗Habits not found." });
    }

    return res.status(200).json(habits);
  };

  delete = async (req: Request, res: Response) => {
    const schema = zod.object({
      id: zod.string(),
    });

    const habit = schema.safeParse(req.params);

    if (!habit.success) {
      const errors = buildValidationErrorMessage(habit.error.issues);

      return res.status(422).json({ messageError: errors });
    }

    const findHabit = await habitModel.findById({
      _id: habit.data.id,
      userId: req.user.id,
    });

    if (!findHabit) {
      return res.status(404).json({ error: "❗Habit not found." });
    }

    await habitModel.findByIdAndDelete({
      _id: habit.data.id,
      userId: req.user.id,
    });

    res.status(204).json();
  };

  toggle = async (req: Request, res: Response) => {
    const schema = zod.object({
      id: zod.string(),
    });

    const validated = schema.safeParse(req.params);

    if (!validated.success) {
      const errors = buildValidationErrorMessage(validated.error.issues);

      return res.status(422).json({ messageError: errors });
    }

    const findHabit = await habitModel.findById({
      _id: validated.data.id,
      userId: req.user.id,
    });

    if (!findHabit) {
      return res.status(404).json({ error: "❗Habit not found." });
    }

    const now = dayjs().startOf("day").toISOString();

    const isHabitCompleted = findHabit.completedDates
      .toObject()
      .find(
        (date: string) =>
          dayjs(String(date)).startOf("day").toISOString() === now,
      );

    if (isHabitCompleted) {
      const updatedHabit = await habitModel.findByIdAndUpdate(
        {
          _id: validated.data.id, //where (onde)
          userId: req.user.id,
        },
        {
          //remove o item do array
          $pull: {
            completedDates: now, //what (o que)
          },
        },
        {
          returnDocument: "after", //retorno do documento atualizado
        },
      );

      return res.status(200).json(updatedHabit);
    }

    const updatedHabit = await habitModel.findByIdAndUpdate(
      {
        _id: validated.data.id, //where (onde)
        userId: req.user.id,
      },
      {
        //adiciona o item no array
        $push: {
          completedDates: now, //what (o que)
        },
      },
      {
        returnDocument: "after", //retorno do documento atualizado
      },
    );

    return res.status(200).json(updatedHabit);
  };

  metrics = async (req: Request, res: Response) => {
    const metricsSchema = zod.object({
      id: zod.string(),
      date: zod.coerce.date(),
    });

    const metrics = metricsSchema.safeParse({ ...req.params, ...req.query });

    if (!metrics.success) {
      const errors = buildValidationErrorMessage(metrics.error.issues);

      return res.status(422).json({ messageError: errors });
    }

    const dateFrom = dayjs(metrics.data.date).startOf("day");
    const dateTo = dayjs(metrics.data.date).endOf("month");

    const [habitMetrics] = await habitModel
      .aggregate()
      .match({
        _id: new mongoose.Types.ObjectId(metrics.data.id),
        userId: req.user.id,
      })
      .project({
        _id: 1,
        name: 1,
        completedDates: {
          $filter: {
            input: "$completedDates",
            as: "completedDate",
            cond: {
              $and: [
                {
                  $gte: ["$$completedDate", dateFrom.toDate()],
                },
                {
                  $lte: ["$$completedDate", dateTo.toDate()],
                },
              ],
            },
          },
        },
      });

    if (!habitMetrics) {
      return res.status(404).json({ error: "❗Habit not found." });
    }

    res.status(200).json(habitMetrics);
  };
}
