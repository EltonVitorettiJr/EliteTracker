import { type Request, type Response, Router } from "express";
import packageJson from "../../package.json";
import { HabitsController } from "../controllers/habits.controller";

export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  const { name, description, version } = packageJson;

  return res.status(200).json({
    name,
    description,
    version,
  });
});

const habitsController = new HabitsController();

routes.post("/habits", habitsController.store);
