import knexGenerator from "knex";
import db from "../config/db.config.js";

// Initialize Knex with the database configuration
const knex = knexGenerator({ ...db });

// Export the configured Knex instance for use in the application
export default knex;
