import { migrate as migrateNeon } from "drizzle-orm/neon-http/migrator";

import { initDatabase } from "./index";

const main = async () => {
  try {
    const db = initDatabase(process.env.DATABASE_URL!);

    await migrateNeon(db as any, {
      migrationsFolder: "src/database/migrations"
    });

    console.log("✓ Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("✗ Error during migration:", error);
    process.exit(1);
  }
};

main();
