import db from "../config/db.config.js";

// Define the path to the migration stub template,
// which will be used as a boilerplate for new migrations.
export default {
  migrations: { stub: "./template/migration.js" },
  ...db,
};
