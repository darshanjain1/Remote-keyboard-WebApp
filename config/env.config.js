import { config } from "dotenv";
import {fileURLToPath} from 'url'
import path, { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url))

config({ path:path.join(__dirname,'..','.env') });

export const {
  NODE_ENV,
  PORT,
  DATABASE_NAME,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_CHARSET,
} = process.env;
