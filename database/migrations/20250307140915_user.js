/** @typedef {import('knex/types').Knex} knex */

/**
 * Creates the "users" table in the database.
 *
 * @param {knex} knex - Knex instance to interact with the database.
 * @returns {Promise<void>}
 */
export const up = async (knex) => {
  return knex.schema.createTable("users", (table) => {
    // Primary key: Auto-incrementing ID
    table.increments("id").primary();

    // Unique identifier for the user
    table.integer("identifier").notNullable().unique();

    // User's name with a maximum length of 75 characters
    table.string("name", 75).notNullable();

    // Boolean flag to track if the user currently has keyboard control
    table
      .boolean("has_keyboard_control")
      .notNullable()
      .defaultTo(false)
      .comment("false -> No control, true -> Has control");

    // Enum to store user status (1 -> Active, 2 -> Inactive)
    table
      .enum("status", [1, 2])
      .notNullable()
      .defaultTo(1)
      .comment("1 -> Active, 2 -> Inactive");

    // Timestamp for tracking the user's last activity
    table.timestamp("last_activity").nullable();

    // Color associated with the user (used for UI differentiation)
    table
      .string("color")
      .nullable()
      .comment("Identifier for the key pressed by this user");

    // Timestamp for when the user record was created
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();

    // Timestamp for when the user record was last updated
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    // Timestamp for soft deletion (null means the record is active)
    table.timestamp("deleted_at").nullable();
  });
};

/**
 * Drops the "users" table if it exists.
 *
 * @param {knex} knex - Knex instance to interact with the database.
 * @returns {Promise<void>}
 */
export const down = async (knex) => {
  return knex.schema.dropTableIfExists("users");
};
