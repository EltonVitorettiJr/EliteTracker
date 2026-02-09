import { type Request, type Response, Router } from "express";
import packageJson from "../../package.json";
import { AuthController } from "../controllers/auth.controller";
import { FocusTimeController } from "../controllers/focus-time.controller";
import { HabitsController } from "../controllers/habits.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const routes = Router();

routes.get("/", (_req: Request, res: Response) => {
  const { name, description, version } = packageJson;

  return res.status(200).json({
    name,
    description,
    version,
  });
});

const habitsController = new HabitsController();
const focusTimeController = new FocusTimeController();
const authController = new AuthController();

//rotas de autenticação
routes.get("/auth", authController.auth);
routes.get("/auth/callback", authController.authCallback);

//rotas protegidas
routes.use(authMiddleware);

//rotas de habitos
routes.post("/habits", habitsController.store);
routes.get("/habits", habitsController.index);
routes.delete("/habits/:id", habitsController.delete);
routes.patch("/habits/:id/toggle", habitsController.toggle);
routes.get("/habits/:id/metrics", habitsController.metrics);

//rotas de focus time
routes.post("/focus-time", focusTimeController.store);
routes.delete("/focus-time/:id", focusTimeController.delete);
routes.get("/focus-time", focusTimeController.index);
routes.get("/focus-time/metrics", focusTimeController.metricsByMonth);
