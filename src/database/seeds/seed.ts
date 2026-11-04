import { AppDataSource } from "../data-source";
import { seedAdmin } from "./admin.seed";
import { seedSetting } from "./setting.seed";

async function seed() {
  try {
    await AppDataSource.initialize();
    await AppDataSource.transaction(async (manager) => {
      await seedAdmin(manager);
      await seedSetting(manager);
      console.log("Database seed completed.");
    });
  } catch (err) {
    console.error("Database seed failed.", err);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  }
}

seed();
