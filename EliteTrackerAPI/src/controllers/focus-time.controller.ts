import dayjs from "dayjs";
import type { Request, Response } from "express";
import * as zod from "zod";
import { FocusTimeModel } from "../schemas/focus-time.model";
import buildValidationErrorMessage from "../utils/buildValidationErrorMessage.util";

export class FocusTimeController {
  store = async (req: Request, res: Response) => {
    const focusTimeSchema = zod.object({
      timeFrom: zod.coerce.date(),
      timeTo: zod.coerce.date(),
    });

    const focusTime = focusTimeSchema.safeParse(req.body);

    if (!focusTime.success) {
      const errors = buildValidationErrorMessage(focusTime.error.issues);

      return res.status(422).json({ messageError: errors });
    }

    const focusTimeFrom = dayjs(focusTime.data.timeFrom);
    const focusTimeTo = dayjs(focusTime.data.timeTo);

    const validateFrom = focusTimeFrom.isBefore(focusTimeTo);

    if (!validateFrom) {
      return res.status(400).json({ error: "❗Invalid time range." });
    }

    const newTimeFocusInterval = await FocusTimeModel.create({
      userId: req.user.id,
      timeFrom: focusTimeFrom.toDate(),
      timeTo: focusTimeTo.toDate(),
    });

    return res.status(201).json(newTimeFocusInterval);
  };

  delete = async (req: Request, res: Response) => {
    const focusTimeParamsSchema = zod.object({
      id: zod.string(),
    });

    const validatedId = focusTimeParamsSchema.safeParse(req.params);

    if (!validatedId.success) {
      const errors = buildValidationErrorMessage(validatedId.error.issues);

      return res.status(422).json({ error: errors });
    }

    await FocusTimeModel.deleteOne({
      _id: validatedId.data.id,
      userId: req.user.id,
    });

    return res.status(204);
  };

  metricsByMonth = async (req: Request, res: Response) => {
    const focusTimeParamsSchema = zod.object({
      date: zod.coerce.date(),
    });

    const validatedDate = focusTimeParamsSchema.safeParse(req.query);

    if (!validatedDate.success) {
      const errors = buildValidationErrorMessage(validatedDate.error.issues);

      return res.status(422).json({ error: errors });
    }

    const dateFrom = dayjs(validatedDate.data.date).startOf("month");
    const dateTo = dayjs(validatedDate.data.date).endOf("month");

    const focusTimesMetrics = await FocusTimeModel.aggregate()
      .match({
        userId: req.user.id,
        timeFrom: {
          $gte: dateFrom.toDate(),
          $lt: dateTo.toDate(),
        },
      })
      .project({
        year: { $year: "$timeFrom" },
        month: { $month: "$timeFrom" },
        day: { $dayOfMonth: "$timeFrom" },
      })
      .sort({ year: 1, month: 1, day: 1 })
      .group({
        _id: ["$year", "$month", "$day"],
        count: { $sum: 1 },
      });

    return res.status(200).json(focusTimesMetrics);
  };

  index = async (req: Request, res: Response) => {
    const focusTimesMetricsShema = zod.object({
      date: zod.coerce.date(),
    });

    const validatedDate = focusTimesMetricsShema.safeParse(req.query);

    if (!validatedDate.success) {
      const errors = buildValidationErrorMessage(validatedDate.error.issues);

      return res.status(422).json({ error: errors });
    }

    const dateFrom = dayjs(validatedDate.data.date).startOf("day");
    const dateTo = dayjs(validatedDate.data.date).endOf("day");

    const focusTimesMetrics = await FocusTimeModel.find({
      userId: req.user.id,
      timeFrom: {
        $gte: dateFrom.toDate(),
        $lte: dateTo.toDate(),
      },
    }).sort({ timeFrom: 1 });

    return res.status(200).json(focusTimesMetrics);
  };
}
