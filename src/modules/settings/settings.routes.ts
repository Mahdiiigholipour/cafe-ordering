import { Router } from "express";
import { settignsService } from ".";
import { createImageUpload } from "../../common/middlewares/upload.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { authenticate } from "../auth";
import { authorize } from "../auth/middlewares/authorize.middleware";
import { SettingsController } from "./settings.controller";
import { UpdateSettingsSchema } from "./settings.schema";

const settingsController = new SettingsController(settignsService);
const upload = createImageUpload("settings");
const router = Router();

router.use(authenticate, authorize());
router
  .route("/")
  .get(settingsController.getSettings)
  .patch(
    validate({ body: UpdateSettingsSchema }),
    settingsController.updateSettings,
  );

router
  .route("/logo")
  .post(upload.single("logo"), settingsController.setLogo)
  .delete(settingsController.removeLogo);

export default router;
