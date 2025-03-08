/**
 * Creates the "keyboard_keys" table in the database.
 *
 * @param { import("knex").Knex } knex - Knex instance to interact with the database.
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  return knex.schema.createTable("keyboard_keys", (table) => {
    // Primary key: Auto-incrementing ID for each key entry
    table.increments("id").primary();

    // The key value (e.g., "A", "Enter", "Shift")
    table.string("key").notNullable();

    // Boolean flag to track if the key is enabled or disabled
    table
      .boolean("is_key_enabled")
      .notNullable()
      .defaultTo(true)
      .comment("false -> Disabled, true -> Enabled");

    // Boolean flag to track if the key is currently pressed
    table
      .boolean("is_pressed")
      .notNullable()
      .defaultTo(false)
      .comment("false -> Not pressed, true -> Pressed");

    // Foreign key reference to the user who pressed the key
    table
      .integer("pressed_by_user")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");

    // Timestamp for when the key record was created
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();

    // Timestamp for when the key record was last updated
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
};

/**
 * Drops the "keyboard_keys" table if it exists.
 *
 * @param { import("knex").Knex } knex - Knex instance to interact with the database.
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.schema.dropTableIfExists("keyboard_keys");
};
