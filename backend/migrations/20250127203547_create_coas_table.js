exports.up = function(knex) {
    return knex.schema.createTable('coas', table => {
      table.uuid('id').primary();
      table.string('product_id').notNullable();
      table.integer('edition_number').notNullable();
      table.uuid('owner_id');
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('coas');
  };