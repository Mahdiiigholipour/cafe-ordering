import { EntityManager } from "typeorm";
import { SettingEntity } from "../../modules/setting/setting.entity";

export async function seedSetting(manager: EntityManager) {
  const settingRepository = manager.getRepository(SettingEntity);

  if ((await settingRepository.count()) > 0) {
    console.log("Settings already exist, skipped.");
    return;
  }

  const defaultSetting = settingRepository.create({
    cafeName: "Cafe",
    servicePercent: 0,
    taxPercent: 0,
    openingTime: "09:00:00",
    closingTime: "23:00:00",
  });

  await settingRepository.save(defaultSetting);
  console.log("Settings created");
}
