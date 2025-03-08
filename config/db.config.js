import {
  DATABASE_USERNAME,
  DATABASE_HOST,
  DATABASE_PASSWORD,
  DATABASE_CHARSET,
  DATABASE_PORT,
  DATABASE_NAME,
} from "./env.config.js";

export default {
  client: "mysql2",
  connection: {
    host: DATABASE_HOST,
    port: +(DATABASE_PORT || 3306),
    database: DATABASE_NAME,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    charset: DATABASE_CHARSET || "utf8mb4",
  },
};
