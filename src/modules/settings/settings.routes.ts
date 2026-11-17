import { Router } from "express";
import { settignsService } from ".";
import { validate } from "../../common/middlewares/validate.middleware";
import { authorize } from "../auth/middlewares/authorize.middleware";
import { SettingsController } from "./settings.controller";
import { UpdateSettingsSchema } from "./settings.schema";

const settingsController = new SettingsController(settignsService);
const router = Router();

router.use(authorize());
router
  .route("/")
  .get(settingsController.getSettings)
  .patch(
    validate({ body: UpdateSettingsSchema }),
    settingsController.updateSettings,
  );

export default router;
