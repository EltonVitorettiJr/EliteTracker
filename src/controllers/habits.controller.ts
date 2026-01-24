import type { Request, Response } from "express";

export class HabitsController {
  private readonly habits: any[] = [];

  store = (req: Request, res: Response): Response => {
    const { name } = req.body;

    const newHabit = {
      name,
    };

    this.habits.push(newHabit);

    return res.status(201).json(newHabit);
  };
}
