/** @typedef {import('knex/types').Knex} knex */

/**
 * 
 * @param {knex} knex 
 * @returns {Promise<void>}
 */
export const up = async (knex) => {
	return knex.schema.createTable('tableName');
  };
  
  /**
   * 
   * @param {knex} knex 
   * @returns {Promise<void>}
   */
  export const down = async (knex) => {
	return knex.schema.dropTableIfExists('tableName');
  };
  