import constants from "../../utils/constants.js";

/**
 * Seeds the "keyboard_keys" table with predefined keyboard keys.
 *
 * @param { import("knex").Knex } knex - Knex instance to interact with the database.
 * @returns { Promise<void> }
 */
export const seed = async function (knex) {
  // Delete all existing records in the "keyboard_keys" table before inserting new ones
  await knex("keyboard_keys").del();

  // Insert predefined keyboard keys from the constants file
  return await knex("keyboard_keys").insert(constants.keyboardKeys);
};
